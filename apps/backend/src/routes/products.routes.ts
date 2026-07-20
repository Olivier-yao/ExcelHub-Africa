import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { fail, ok } from '../utils/http.js';

export const productsRouter = Router();

const publicSelect = {
  id: true,
  slug: true,
  name: true,
  category: true,
  priceFcfa: true,
  tag: true,
  color: true,
  description: true,
  features: true,
} as const;

productsRouter.get('/', async (_request, response) => {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: 'asc' },
    select: publicSelect,
  });
  return ok(response, products);
});

productsRouter.get('/:slug', async (request, response) => {
  const product = await prisma.product.findFirst({
    where: { slug: request.params.slug, published: true },
    select: publicSelect,
  });
  if (!product) {
    return fail(response, 404, 'Produit introuvable');
  }
  return ok(response, product);
});
