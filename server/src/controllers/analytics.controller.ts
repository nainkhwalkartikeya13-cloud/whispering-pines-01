import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';

export async function dashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalBookings,
      confirmedBookings,
      pendingBookings,
      recentBookings,
      totalRevenue,
      totalAccommodations,
      totalReviews,
      unreadContacts,
      recentActivity,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'confirmed' } }),
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.booking.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.booking.aggregate({
        _sum: { totalAmountCents: true },
        where: { status: { in: ['confirmed', 'pending'] } },
      }),
      prisma.accommodation.count({ where: { isActive: true } }),
      prisma.review.count(),
      prisma.contactSubmission.count({ where: { isRead: false } }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          guestFirstName: true,
          guestLastName: true,
          status: true,
          totalAmountCents: true,
          createdAt: true,
          accommodation: { select: { name: true } },
        },
      }),
    ]);

    res.json({
      stats: {
        totalBookings,
        confirmedBookings,
        pendingBookings,
        recentBookings,
        totalRevenue: totalRevenue._sum.totalAmountCents ?? 0,
        totalAccommodations,
        totalReviews,
        unreadContacts,
      },
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
}
