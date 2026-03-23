import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category } = req.query;

    const services = await prisma.service.findMany({
      where: {
        isActive: true,
        ...(category ? { category: category as string } : {}),
      },
      orderBy: { sortOrder: 'asc' },
    });

    res.json({ services });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const service = await prisma.service.create({ data: req.body });
    res.status(201).json({ service });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const service = await prisma.service.update({ where: { id }, data: req.body });
    res.json({ service });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    // Check if this service has been used in any bookings
    const usageCount = await prisma.bookingEnhancement.count({ where: { serviceId: id } });

    if (usageCount > 0) {
      // Soft delete — preserve booking history
      await prisma.service.update({ where: { id }, data: { isActive: false } });
      res.json({ message: 'Service deactivated (has booking history)' });
    } else {
      await prisma.service.delete({ where: { id } });
      res.json({ message: 'Service deleted' });
    }
  } catch (err) {
    next(err);
  }
}
