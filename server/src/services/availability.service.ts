import { prisma } from '../db/prisma';

export function calculateNights(checkIn: Date, checkOut: Date): number {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.max(1, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export async function checkAvailability(
  checkIn: Date,
  checkOut: Date,
  minGuests: number
) {
  // Find bookings that overlap with the requested date range
  const overlapping = await prisma.booking.findMany({
    where: {
      status: { in: ['pending', 'confirmed'] },
      AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
    },
    select: { accommodationId: true },
  });

  const unavailableIds = overlapping.map((b) => b.accommodationId);

  return prisma.accommodation.findMany({
    where: {
      isActive: true,
      maxGuests: { gte: minGuests },
      ...(unavailableIds.length > 0 ? { id: { notIn: unavailableIds } } : {}),
    },
    orderBy: [{ type: 'asc' }, { pricePerNight: 'asc' }],
  });
}
