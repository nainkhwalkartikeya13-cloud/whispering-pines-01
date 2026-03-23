import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';
import { checkAvailability } from '../services/availability.service';

function parseAccommodation(acc: {
  images: string;
  amenityTags: string;
  [key: string]: unknown;
}) {
  return {
    ...acc,
    images: JSON.parse(acc.images) as string[],
    amenityTags: JSON.parse(acc.amenityTags) as string[],
  };
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { checkIn, checkOut, guests } = req.query;

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn as string);
      const checkOutDate = new Date(checkOut as string);
      const guestCount = guests ? parseInt(guests as string, 10) : 1;

      const accommodations = await checkAvailability(checkInDate, checkOutDate, guestCount);
      res.json({ accommodations: accommodations.map(parseAccommodation) });
      return;
    }

    const accommodations = await prisma.accommodation.findMany({
      where: { isActive: true },
      orderBy: [{ type: 'asc' }, { pricePerNight: 'asc' }],
    });

    res.json({ accommodations: accommodations.map(parseAccommodation) });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;

    const accommodation = await prisma.accommodation.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        isActive: true,
      },
    });

    if (!accommodation) {
      res.status(404).json({ error: 'Accommodation not found' });
      return;
    }

    res.json({ accommodation: parseAccommodation(accommodation) });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = req.body as {
      slug: string;
      name: string;
      type: string;
      description: string;
      sqft?: number;
      maxGuests: number;
      pricePerNight: number;
      images: string[];
      amenityTags: string[];
    };

    const existing = await prisma.accommodation.findUnique({ where: { slug: data.slug } });
    if (existing) {
      res.status(409).json({ error: 'Slug already exists' });
      return;
    }

    const accommodation = await prisma.accommodation.create({
      data: {
        ...data,
        images: JSON.stringify(data.images),
        amenityTags: JSON.stringify(data.amenityTags),
      },
    });

    res.status(201).json({ accommodation: parseAccommodation(accommodation) });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const data = req.body as {
      images?: string[];
      amenityTags?: string[];
      [key: string]: unknown;
    };

    const updateData: Record<string, unknown> = { ...data };
    if (data.images) updateData.images = JSON.stringify(data.images);
    if (data.amenityTags) updateData.amenityTags = JSON.stringify(data.amenityTags);

    const accommodation = await prisma.accommodation.update({
      where: { id },
      data: updateData,
    });

    res.json({ accommodation: parseAccommodation(accommodation) });
  } catch (err) {
    next(err);
  }
}

export async function deactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.accommodation.update({ where: { id }, data: { isActive: false } });
    res.json({ message: 'Accommodation deactivated' });
  } catch (err) {
    next(err);
  }
}
