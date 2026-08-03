import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: config.clientOrigin }));
  app.use(express.json({ limit: '50kb' }));
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/game', gameRoutes);
  app.use((error, _req, res, _next) => {
    const status = Number(error.status ?? 500);
    if (status >= 500) console.error(error);
    return res.status(status).json({ error: status >= 500 ? 'Internal server error.' : error.message });
  });
  return app;
}