import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { fail, ok } from '../utils/http.js';

export const adminProductsRouter = Router();

adminProductsRouter.use(requireAuth, requireAdmin);

const uploadRoot = path.resolve(env.UPLOAD_DIR);
fs.mkdirSync(uploadRoot, { recursive: true });

const ALLOWED_EXTENSIONS = new Set(['.xlsx', '.xlsm']);

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadRoot,
    filename: (_request, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${randomUUID()}${extension}`);
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return callback(new Error('Seuls les fichiers .xlsx et .xlsm sont acceptes'));
    }
    return callback(null, true);
  },
});

const productSchema = z.object({
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, 'Slug: minuscules, chiffres et tirets uniquement'),
  name: z.string().min(2),
  category: z.string().min(2),
  priceFcfa: z.coerce.number().int().positive(),
  tag: z.string().default(''),
  color: z.string().default('emerald'),
  description: z.string().min(10),
  features: z
    .union([z.array(z.string()), z.string()])
    .transform((value) =>
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

adminProductsRouter.get('/', async (_request, response) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });
  return ok(response, products);
});

adminProductsRouter.post('/', upload.single('file'), async (request, response) => {
  const parsed = productSchema.safeParse(request.body);
  if (!parsed.success) {
    return fail(response, 400, 'Donnees invalides', parsed.error.issues);
  }

  const existing = await prisma.product.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return fail(response, 409, 'Un produit utilise deja ce slug');
  }

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      fileName: request.file?.originalname ?? null,
      filePath: request.file?.filename ?? null,
    },
  });
  return ok(response, product, 'Produit cree', 201);
});

adminProductsRouter.put('/:id', upload.single('file'), async (request, response) => {
  const parsed = productSchema.partial().safeParse(request.body);
  if (!parsed.success) {
    return fail(response, 400, 'Donnees invalides', parsed.error.issues);
  }

  const current = await prisma.product.findUnique({ where: { id: request.params.id } });
  if (!current) {
    return fail(response, 404, 'Produit introuvable');
  }

  const product = await prisma.product.update({
    where: { id: current.id },
    data: {
      ...parsed.data,
      ...(request.file
        ? { fileName: request.file.originalname, filePath: request.file.filename }
        : {}),
    },
  });

  // Si un nouveau fichier remplace l'ancien, on supprime l'ancien du disque.
  if (request.file && current.filePath && current.filePath !== product.filePath) {
    fs.rm(path.join(uploadRoot, current.filePath), { force: true }, () => undefined);
  }

  return ok(response, product, 'Produit mis a jour');
});

adminProductsRouter.delete('/:id', async (request, response) => {
  const current = await prisma.product.findUnique({ where: { id: request.params.id } });
  if (!current) {
    return fail(response, 404, 'Produit introuvable');
  }

  await prisma.product.delete({ where: { id: current.id } });
  if (current.filePath) {
    fs.rm(path.join(uploadRoot, current.filePath), { force: true }, () => undefined);
  }
  return ok(response, { id: current.id }, 'Produit supprime');
});

// Verification du fichier par l'admin (le telechargement client passera par les
// jetons d'achat lors de la phase paiement).
adminProductsRouter.get('/:id/download', async (request, response) => {
  const product = await prisma.product.findUnique({ where: { id: request.params.id } });
  if (!product?.filePath) {
    return fail(response, 404, 'Aucun fichier associe a ce produit');
  }
  return response.download(
    path.join(uploadRoot, product.filePath),
    product.fileName ?? 'fichier.xlsx',
  );
});
