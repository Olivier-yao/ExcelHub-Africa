import fs from 'node:fs';
import path from 'node:path';
import { Router } from 'express';
import type { Request } from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { fail, ok } from '../utils/http.js';

const uploadRoot = path.resolve(env.UPLOAD_DIR);

export const adminProductsRouter = Router();

adminProductsRouter.use(requireAuth, requireAdmin);

const productSchema = z.object({
  offerId: z.string().min(1, 'Offre requise'),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, 'Slug: minuscules, chiffres et tirets uniquement'),
  name: z.string().min(2),
  priceFcfa: z.coerce.number().int().positive(),
  description: z.string().min(10),
  features: z.union([z.array(z.string()), z.string()]).transform((value) =>
    Array.isArray(value)
      ? value
      : value
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
  ),
  published: z
    .union([z.boolean(), z.string()])
    .transform((value) => value === true || value === 'true' || value === '1')
    .default(false),
});

adminProductsRouter.get('/', async (request, response) => {
  const offerId =
    typeof request.query.offerId === 'string' ? request.query.offerId : undefined;
  const products = await prisma.product.findMany({
    where: offerId ? { offerId } : undefined,
    orderBy: { createdAt: 'asc' },
    include: { variants: true },
  });
  return ok(response, products);
});

adminProductsRouter.post('/', async (request, response) => {
  const parsed = productSchema.safeParse(request.body);
  if (!parsed.success) {
    return fail(response, 400, 'Donnees invalides', parsed.error.issues);
  }

  const offer = await prisma.offer.findUnique({ where: { id: parsed.data.offerId } });
  if (!offer) {
    return fail(response, 400, 'Offre introuvable');
  }

  const existing = await prisma.product.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return fail(response, 409, 'Un produit utilise deja ce slug');
  }

  const product = await prisma.product.create({ data: parsed.data });
  return ok(response, product, 'Produit cree', 201);
});

adminProductsRouter.put('/:id', async (request: Request<{ id: string }>, response) => {
  const parsed = productSchema.partial().safeParse(request.body);
  if (!parsed.success) {
    return fail(response, 400, 'Donnees invalides', parsed.error.issues);
  }

  if (parsed.data.offerId) {
    const offer = await prisma.offer.findUnique({ where: { id: parsed.data.offerId } });
    if (!offer) {
      return fail(response, 400, 'Offre introuvable');
    }
  }

  const current = await prisma.product.findUnique({ where: { id: request.params.id } });
  if (!current) {
    return fail(response, 404, 'Produit introuvable');
  }

  const product = await prisma.product.update({
    where: { id: current.id },
    data: parsed.data,
  });
  return ok(response, product, 'Produit mis a jour');
});

adminProductsRouter.delete('/:id', async (request, response) => {
  const current = await prisma.product.findUnique({
    where: { id: request.params.id },
    include: { variants: true },
  });
  if (!current) {
    return fail(response, 404, 'Produit introuvable');
  }

  await prisma.productVariant.deleteMany({ where: { productId: current.id } });
  await prisma.product.delete({ where: { id: current.id } });

  for (const variant of current.variants) {
    if (variant.filePath) {
      fs.rm(path.join(uploadRoot, variant.filePath), { force: true }, () => undefined);
    }
  }

  return ok(response, { id: current.id }, 'Produit supprime');
});
