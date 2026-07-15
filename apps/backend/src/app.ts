import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';

export const app = express();

app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_request, response) => {
  response.status(200).json({ success: true, data: { status: 'ok' }, message: '' });
});

app.get('/api/v1', (_request, response) => {
  response.status(200).json({
    success: true,
    data: { service: 'excelhub-api', version: 'v1' },
    message: '',
  });
});

app.use((_request, response) => {
  response.status(404).json({ success: false, message: 'Route introuvable', errors: [] });
});
