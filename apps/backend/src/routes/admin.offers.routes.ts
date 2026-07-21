import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { fail, ok } from '../utils/http.js';

export const adminOffersRouter = Router();

adminOffersRouter.use(requireAuth, requireAdmin);

const offerSchema = z.object({
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, 'Slug: minuscules, chiffres et tirets uniquement'),
  name: z.string().min(2),
  category: z.string().min(2),
  tag: z.string().default(''),
  color: z.string().default('emerald'),
  description: z.string().min(10),
  published: z
    .union([z.boolean(), z.string()])
    .transform((value) => value === true || value === 'true' || value === '1')
    .default(false),
});

adminOffersRouter.get('/', async (_request, response) => {
  const offers = await prisma.offer.findMany({
    orderBy: { createdAt: 'asc' },
    include: { products: true },
  });
  return ok(response, offers);
});

adminOffersRouter.post('/', async (request, response) => {
  const parsed = offerSchema.safeParse(request.body);
  if (!parsed.success) {
    return fail(response, 400, 'Donnees invalides', parsed.error.issues);
  }

  const existing = await prisma.offer.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return fail(response, 409, 'Une offre utilise deja ce slug');
  }

  const offer = await prisma.offer.create({ data: parsed.data });
  return ok(response, offer, 'Offre creee', 201);
});

adminOffersRouter.put('/:id', async (request, response) => {
  const parsed = offerSchema.partial().safeParse(request.body);
  if (!parsed.success) {
    return fail(response, 400, 'Donnees invalides', parsed.error.issues);
  }

  const current = await prisma.offer.findUnique({ where: { id: request.params.id } });
  if (!current) {
    return fail(response, 404, 'Offre introuvable');
  }

  const offer = await prisma.offer.update({
    where: { id: current.id },
    data: parsed.data,
  });
  return ok(response, offer, 'Offre mise a jour');
});

adminOffersRouter.delete('/:id', async (request, response) => {
  const current = await prisma.offer.findUnique({
    where: { id: request.params.id },
    include: { products: true },
  });
  if (!current) {
    return fail(response, 404, 'Offre introuvable');
  }
  if (current.products.length > 0) {
    return fail(response, 409, 'Impossible de supprimer une offre contenant des outils');
  }

  await prisma.offer.delete({ where: { id: current.id } });
  return ok(response, { id: current.id }, 'Offre supprimee');
});
