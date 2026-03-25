import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';
import { checkAvailability, calculateNights } from '../services/availability.service';
import { sendBookingConfirmation, sendBookingNotification } from '../services/email.service';
import { env } from '../config/env';
import Stripe from 'stripe';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10' as any, // use current stable or any, avoids node-ssdk type mismatch
});

// POST /api/payments/create-checkout-session
// Called when user submits guest details — creates a Stripe Checkout Session
export async function createCheckoutSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      accommodationId,
      checkIn,
      checkOut,
      guests,
      selectedServiceIds,
      guestFirstName,
      guestLastName,
      guestEmail,
      specialRequests,
    } = req.body as {
      accommodationId: string;
      checkIn: string;
      checkOut: string;
      guests: { adults: number; children: number };
      selectedServiceIds: string[];
      guestFirstName: string;
      guestLastName: string;
      guestEmail: string;
      specialRequests?: string;
    };

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      res.status(400).json({ error: 'Check-out must be after check-in' });
      return;
    }

    // Re-validate availability server-side
    const totalGuests = guests.adults + guests.children;
    const available = await checkAvailability(checkInDate, checkOutDate, totalGuests);
    const isAvailable = available.some((a) => a.id === accommodationId);

    if (!isAvailable) {
      res.status(409).json({ error: 'This accommodation is no longer available for those dates' });
      return;
    }

    const accommodation = await prisma.accommodation.findUnique({ where: { id: accommodationId } });
    if (!accommodation) {
      res.status(404).json({ error: 'Accommodation not found' });
      return;
    }

    const nights = calculateNights(checkInDate, checkOutDate);
    // All prices in DB are stored in cents (e.g. 12500 = $125.00)
    const roomSubtotal = accommodation.pricePerNight * nights;

    let enhancementsSubtotal = 0;
    let services: Array<{ id: string; name: string; price: number }> = [];

    if (selectedServiceIds.length > 0) {
      services = await prisma.service.findMany({
        where: { id: { in: selectedServiceIds }, isActive: true },
        select: { id: true, name: true, price: true },
      });
      enhancementsSubtotal = services.reduce((sum, s) => sum + s.price, 0);
    }

    // Already in cents — no need to multiply by 100
    const totalAmountCents = roomSubtotal + enhancementsSubtotal;

    // Create booking in DB with status 'pending'
    const booking = await prisma.booking.create({
      data: {
        guestFirstName,
        guestLastName,
        guestEmail,
        guestAdults: guests.adults,
        guestChildren: guests.children,
        specialRequests: specialRequests ?? null,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights,
        accommodationId,
        roomSubtotal,
        enhancementsSubtotal,
        totalAmountCents,
        status: 'pending',
        enhancements: {
          create: services.map((s) => ({
            serviceId: s.id,
            priceSnapshot: s.price,
          })),
        },
      },
    });

    // Create line items for Stripe Checkout
    // Stripe expects unit_amount in cents — our values are already in cents
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${accommodation.name} (${nights} Nights)`,
            description: `${checkInDate.toLocaleDateString()} to ${checkOutDate.toLocaleDateString()}`,
          },
          unit_amount: roomSubtotal,
        },
        quantity: 1,
      },
    ];

    if (enhancementsSubtotal > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Selected Enhancements',
            description: services.map((s) => s.name).join(', '),
          },
          unit_amount: enhancementsSubtotal,
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: guestEmail,
      client_reference_id: booking.id,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${env.FRONTEND_URL}/booking/confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.FRONTEND_URL}/booking?canceled=true`,
      metadata: {
        bookingId: booking.id,
      },
    });

    // Store the stripe session ID so we can verify later
    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripePaymentIntentId: session.id },
    });

    res.json({
      url: session.url,
      breakdown: {
        roomSubtotal: roomSubtotal / 100,
        enhancementsSubtotal: enhancementsSubtotal / 100,
        total: totalAmountCents / 100,
        nights,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/payments/webhook
// Called by Stripe exactly once when payment succeeds
export async function webhook(req: Request, res: Response): Promise<void> {
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;

  try {
    if (!sig) throw new Error('No signature provided');
    // Important: req.body must be raw buffer for signature verification
    event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    return;
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      try {
        const booking = await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: 'confirmed',
            paidAt: new Date(),
            stripeChargeId: session.payment_intent as string,
          },
          include: {
            accommodation: true,
            enhancements: { include: { service: true } },
          },
        });

        // Send confirmation emails (non-blocking)
        void sendBookingConfirmation(booking);
        void sendBookingNotification(booking);
      } catch (e) {
        console.error('Error updating booking status after checkout:', e);
      }
    }
  }

  res.json({ received: true });
}
