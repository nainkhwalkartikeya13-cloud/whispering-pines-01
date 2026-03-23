import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma';
import { env } from '../config/env';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const admin = await prisma.admin.findUnique({ where: { email } });

    // Always compare to prevent timing attacks
    const passwordValid = admin
      ? await bcrypt.compare(password, admin.passwordHash)
      : await bcrypt.compare(password, '$2b$12$invalidhashfortimingprotection');

    if (!admin || !passwordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { sub: admin.id, email: admin.email, role: 'admin' },
      env.JWT_SECRET as string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { expiresIn: env.JWT_EXPIRES_IN } as any
    );

    res.json({
      token,
      expiresIn: 86400,
      admin: { id: admin.id, email: admin.email },
    });
  } catch (err) {
    next(err);
  }
}

export function me(req: Request, res: Response): void {
  res.json({ user: req.user });
}
