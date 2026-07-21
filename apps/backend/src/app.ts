import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { env } from './config/env.js';
import { adminOffersRouter } from './routes/admin.offers.routes.js';
import { adminProductVariantsRouter } from './routes/admin.product-variants.routes.js';
import { adminProductsRouter } from './routes/admin.products.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { offersRouter } from './routes/offers.routes.js';
import { fail, ok } from './utils/http.js';

export const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/health', (_request, response) => {
  return ok(response, { status: 'ok' });
});

app.get('/api/v1', (_request, response) => {
  return ok(response, { service: 'excelhub-api', version: 'v1' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/offers', offersRouter);
app.use('/api/v1/admin/offers', adminOffersRouter);
app.use('/api/v1/admin/products', adminProductsRouter);
app.use('/api/v1/admin/product-variants', adminProductVariantsRouter);

app.use((_request, response) => {
  return fail(response, 404, 'Route introuvable');
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  console.error(error);
  return fail(response, 500, 'Erreur interne, veuillez reessayer');
});
