import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env';

interface AppError extends Error {
  status?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    const fieldErrors = err.flatten().fieldErrors;
    res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      fields: fieldErrors,
    });
    return;
  }

  // Handle Razorpay SDK errors (plain objects, not Error instances)
  if (!(err instanceof Error) && typeof err === 'object' && err !== null) {
    const rzpErr = err as Record<string, unknown>;
    const statusCode = typeof rzpErr.statusCode === 'number' ? rzpErr.statusCode : 500;
    const description =
      rzpErr.error && typeof rzpErr.error === 'object'
        ? (rzpErr.error as Record<string, unknown>).description
        : undefined;
    console.error('[Razorpay Error]', JSON.stringify(rzpErr));
    res.status(statusCode).json({ error: description ?? 'Payment provider error' });
    return;
  }

  const status = err.status ?? 500;
  const message =
    env.NODE_ENV === 'production' && status === 500
      ? 'An unexpected error occurred'
      : err.message;

  if (status === 500) {
    console.error('[Error]', err);
  }

  res.status(status).json({
    error: message || 'An unexpected error occurred',
    ...(err.code ? { code: err.code } : {}),
    ...(env.NODE_ENV === 'development' && status === 500 ? { stack: err.stack } : {}),
  });
}
