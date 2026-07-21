import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { fail, ok } from '../utils/http.js';

export const offersRouter = Router();

const publicProductSelect = {
  id: true,
  slug: true,
  name: true,
  priceFcfa: true,
  description: true,
  features: true,
  variants: {
    where: { published: true },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      color: true,
      description: true,
    },
  },
} as const;

function withPriceRange<T extends { products: { priceFcfa: number }[] }>(offer: T) {
  const prices = offer.products.map((product) => product.priceFcfa);
  return {
    ...offer,
    priceMinFcfa: prices.length ? Math.min(...prices) : null,
    priceMaxFcfa: prices.length ? Math.max(...prices) : null,
  };
}

offersRouter.get('/', async (_request, response) => {
  const offers = await prisma.offer.findMany({
    where: { published: true },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      tag: true,
      color: true,
      description: true,
      products: {
        where: { published: true },
        select: { priceFcfa: true },
      },
    },
  });
  return ok(response, offers.map(withPriceRange));
});

offersRouter.get('/:slug', async (request, response) => {
  const offer = await prisma.offer.findFirst({
    where: { slug: request.params.slug, published: true },
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      tag: true,
      color: true,
      description: true,
      products: {
        where: { published: true },
        orderBy: { priceFcfa: 'asc' },
        select: publicProductSelect,
      },
    },
  });
  if (!offer) {
    return fail(response, 404, 'Offre introuvable');
  }
  return ok(response, withPriceRange(offer));
});
