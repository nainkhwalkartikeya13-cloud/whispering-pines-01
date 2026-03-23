import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';

export async function listPublic(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string ?? '10', 10)));

    const reviews = await prisma.review.findMany({
      where: { isPublished: true },
      select: { id: true, authorName: true, body: true, rating: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    res.json({ reviews });
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string ?? '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string ?? '20', 10)));

    const [total, reviews] = await Promise.all([
      prisma.review.count(),
      prisma.review.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json({ reviews, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.review.create({
      data: { ...req.body, isPublished: false },
    });
    res.status(201).json({ message: 'Review submitted for approval. Thank you!' });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const review = await prisma.review.update({ where: { id }, data: req.body });
    res.json({ review });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
}
