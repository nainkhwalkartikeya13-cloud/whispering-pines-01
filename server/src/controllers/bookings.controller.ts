import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';
import { checkAvailability, calculateNights } from '../services/availability.service';

export async function checkAvailabilityHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { checkIn, checkOut, guests } = req.body as {
      checkIn: string;
      checkOut: string;
      guests: { adults: number; children: number };
    };

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      res.status(400).json({ error: 'Check-out must be after check-in' });
      return;
    }

    const totalGuests = guests.adults + guests.children;
    const nights = calculateNights(checkInDate, checkOutDate);
    const accommodations = await checkAvailability(checkInDate, checkOutDate, totalGuests);

    const parsed = accommodations.map((acc) => ({
      ...acc,
      images: JSON.parse(acc.images) as string[],
      amenityTags: JSON.parse(acc.amenityTags) as string[],
    }));

    res.json({ accommodations: parsed, nights });
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string ?? '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string ?? '20', 10)));
    const status = req.query.status as string | undefined;

    const where = status ? { status } : {};

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: {
          accommodation: { select: { id: true, name: true, type: true } },
          enhancements: { include: { service: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function guestLookup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, lastName } = req.body as { email: string; lastName: string };

    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }
    if (!lastName || lastName.trim().length < 1) {
      res.status(400).json({ error: 'Last name is required.' });
      return;
    }

    // SQLite is case-insensitive for ASCII by default with LIKE,
    // but equals is case-sensitive. Fetch by email then filter by last name.
    const allByEmail = await prisma.booking.findMany({
      where: { guestEmail: email.toLowerCase().trim() },
      include: {
        accommodation: { select: { id: true, name: true, type: true, slug: true, images: true } },
        enhancements: { include: { service: { select: { name: true } } } },
      },
      orderBy: { checkIn: 'desc' },
    });

    const lastNameLower = lastName.trim().toLowerCase();
    const bookings = allByEmail.filter(
      (b) => b.guestLastName.toLowerCase() === lastNameLower
    );

    const parsed = bookings.map((b) => ({
      ...b,
      accommodation: {
        ...b.accommodation,
        images: JSON.parse(b.accommodation.images) as string[],
      },
    }));

    res.json({ bookings: parsed });
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: string };

    const valid = ['pending', 'confirmed', 'cancelled', 'refunded'];
    if (!valid.includes(status)) {
      res.status(400).json({ error: `Status must be one of: ${valid.join(', ')}` });
      return;
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { accommodation: { select: { name: true } } },
    });

    res.json({ booking });
  } catch (err) {
    next(err);
  }
}
