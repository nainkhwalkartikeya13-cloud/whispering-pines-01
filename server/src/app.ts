import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import { globalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import apiRouter from './routes/index';

export function createApp() {
  const app = express();

  // 1. Security headers
  app.use(helmet());

  // 2. CORS
  app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // 3. Global rate limiter
  app.use(globalLimiter);

  // 4. JSON body parser
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: false, limit: '10kb' }));

  // 5. API routes
  app.use('/api', apiRouter);

  // 6. Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 7. 404 handler
  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  // 8. Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
