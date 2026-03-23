import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';
import { prisma } from '../db/prisma';
import { sendContactAutoReply, sendContactNotification } from '../services/email.service';

export async function submit(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, message } = req.body as { name: string; email: string; message: string };

    const sanitizedMessage = sanitizeHtml(message, { allowedTags: [], allowedAttributes: {} });

    const submission = await prisma.contactSubmission.create({
      data: { name, email, message: sanitizedMessage },
    });

    // Non-blocking emails
    void sendContactNotification(name, email, sanitizedMessage);
    void sendContactAutoReply(name, email);

    res.json({
      message: "Your message has been sent. We'll be in touch within 24 hours.",
      id: submission.id,
    });
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string ?? '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string ?? '20', 10)));
    const isRead = req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined;

    const where = isRead !== undefined ? { isRead } : {};

    const [total, submissions] = await Promise.all([
      prisma.contactSubmission.count({ where }),
      prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json({ submissions, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
}

export async function markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: { isRead: true },
    });
    res.json({ submission });
  } catch (err) {
    next(err);
  }
}
