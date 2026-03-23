import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';
import { checkAvailability, calculateNights } from '../services/availability.service';
import { createOrder, verifyPaymentSignature } from '../services/razorpay.service';
import { sendBookingConfirmation, sendBookingNotification } from '../services/email.service';
import { env } from '../config/env';

// POST /api/payments/create-order
// Called when user submits guest details — creates a Razorpay order
export async function createRazorpayOrder(
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

    // Re-validate availability server-side (never trust client)
    const totalGuests = guests.adults + guests.children;
    const available = await checkAvailability(checkInDate, checkOutDate, totalGuests);
    const isAvailable = available.some((a) => a.id === accommodationId);

    if (!isAvailable) {
      res.status(409).json({ error: 'This accommodation is no longer available for those dates' });
      return;
    }

    // Authoritative pricing from DB
    const accommodation = await prisma.accommodation.findUnique({ where: { id: accommodationId } });
    if (!accommodation) {
      res.status(404).json({ error: 'Accommodation not found' });
      return;
    }

    const nights = calculateNights(checkInDate, checkOutDate);
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

    const totalAmount = roomSubtotal + enhancementsSubtotal;
    // Razorpay amounts are in paise (smallest currency unit)
    // For INR: 1 INR = 100 paise
    // For USD: if you use USD, 1 USD = 100 cents — same logic
    const totalAmountPaise = Math.round(totalAmount * 100);

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
        totalAmountCents: totalAmountPaise,
        status: 'pending',
        enhancements: {
          create: services.map((s) => ({
            serviceId: s.id,
            priceSnapshot: s.price,
          })),
        },
      },
    });

    // Create Razorpay order
    const order = await createOrder(totalAmountPaise, booking.id);

    // Store Razorpay order ID on booking
    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripePaymentIntentId: order.id }, // reusing this field for Razorpay order ID
    });

    res.json({
      orderId: order.id,
      bookingId: booking.id,
      amount: totalAmountPaise,
      currency: env.RAZORPAY_CURRENCY,
      keyId: env.RAZORPAY_KEY_ID,
      breakdown: {
        roomSubtotal,
        enhancementsSubtotal,
        total: totalAmount,
        nights,
      },
      prefill: {
        name: `${guestFirstName} ${guestLastName}`,
        email: guestEmail,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/payments/verify
// Called by frontend after Razorpay payment succeeds — verifies signature and confirms booking
export async function verifyPayment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      bookingId: string;
    };

    // Verify HMAC signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      res.status(400).json({ error: 'Payment verification failed. Please contact support.' });
      return;
    }

    // Confirm booking in DB
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'confirmed',
        paidAt: new Date(),
        stripeChargeId: razorpay_payment_id, // reusing field for Razorpay payment ID
      },
      include: {
        accommodation: true,
        enhancements: { include: { service: true } },
      },
    });

    // Send confirmation emails (non-blocking)
    void sendBookingConfirmation(booking);
    void sendBookingNotification(booking);

    res.json({ success: true, bookingId: booking.id });
  } catch (err) {
    next(err);
  }
}

// Keep this empty export so the app.ts import doesn't break
// (we removed the Stripe webhook — Razorpay doesn't need a webhook for basic flow)
export function webhook(_req: Request, res: Response): void {
  res.json({ received: true });
}
