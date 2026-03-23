import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';

export async function subscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body as { email: string };

    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      res.json({ message: 'You are already subscribed!' });
      return;
    }

    await prisma.newsletterSubscriber.create({ data: { email } });
    res.status(201).json({ message: 'Thank you for subscribing!' });
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ subscribers, total: subscribers.length });
  } catch (err) {
    next(err);
  }
}
