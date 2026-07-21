import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { Router } from 'express';
import type { Request } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { fail, ok } from '../utils/http.js';

export const adminProductVariantsRouter = Router();

adminProductVariantsRouter.use(requireAuth, requireAdmin);

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

const variantSchema = z.object({
  productId: z.string().min(1, 'Outil requis'),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug: minuscules, chiffres et tirets uniquement'),
  name: z.string().min(2),
  color: z.string().default('emerald'),
  description: z.string().optional(),
  sheetCount: z.coerce.number().int().positive().default(1),
  howToUse: z.string().optional(),
  published: z
    .union([z.boolean(), z.string()])
    .transform((value) => value === true || value === 'true' || value === '1')
    .default(false),
});

adminProductVariantsRouter.get('/', async (request, response) => {
  const productId =
    typeof request.query.productId === 'string' ? request.query.productId : undefined;
  const variants = await prisma.productVariant.findMany({
    where: productId ? { productId } : undefined,
    orderBy: { createdAt: 'asc' },
  });
  return ok(response, variants);
});

adminProductVariantsRouter.post('/', upload.single('file'), async (request, response) => {
  const parsed = variantSchema.safeParse(request.body);
  if (!parsed.success) {
    return fail(response, 400, 'Donnees invalides', parsed.error.issues);
  }

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
  });
  if (!product) {
    return fail(response, 400, 'Outil introuvable');
  }

  const existing = await prisma.productVariant.findUnique({
    where: {
      productId_slug: { productId: parsed.data.productId, slug: parsed.data.slug },
    },
  });
  if (existing) {
    return fail(response, 409, 'Une variante utilise deja ce slug pour cet outil');
  }

  const variant = await prisma.productVariant.create({
    data: {
      ...parsed.data,
      fileName: request.file?.originalname ?? null,
      filePath: request.file?.filename ?? null,
    },
  });
  return ok(response, variant, 'Variante creee', 201);
});

adminProductVariantsRouter.put(
  '/:id',
  upload.single('file'),
  async (request: Request<{ id: string }>, response) => {
    const parsed = variantSchema.partial().safeParse(request.body);
    if (!parsed.success) {
      return fail(response, 400, 'Donnees invalides', parsed.error.issues);
    }

    if (parsed.data.productId) {
      const product = await prisma.product.findUnique({
        where: { id: parsed.data.productId },
      });
      if (!product) {
        return fail(response, 400, 'Outil introuvable');
      }
    }

    const current = await prisma.productVariant.findUnique({
      where: { id: request.params.id },
    });
    if (!current) {
      return fail(response, 404, 'Variante introuvable');
    }

    const variant = await prisma.productVariant.update({
      where: { id: current.id },
      data: {
        ...parsed.data,
        ...(request.file
          ? { fileName: request.file.originalname, filePath: request.file.filename }
          : {}),
      },
    });

    // Si un nouveau fichier remplace l'ancien, on supprime l'ancien du disque.
    if (request.file && current.filePath && current.filePath !== variant.filePath) {
      fs.rm(path.join(uploadRoot, current.filePath), { force: true }, () => undefined);
    }

    return ok(response, variant, 'Variante mise a jour');
  },
);

adminProductVariantsRouter.delete('/:id', async (request, response) => {
  const current = await prisma.productVariant.findUnique({
    where: { id: request.params.id },
  });
  if (!current) {
    return fail(response, 404, 'Variante introuvable');
  }

  await prisma.productVariant.delete({ where: { id: current.id } });
  if (current.filePath) {
    fs.rm(path.join(uploadRoot, current.filePath), { force: true }, () => undefined);
  }
  return ok(response, { id: current.id }, 'Variante supprimee');
});

// Verification du fichier par l'admin (le telechargement client passera par les
// jetons d'achat lors de la phase paiement).
adminProductVariantsRouter.get('/:id/download', async (request, response) => {
  const variant = await prisma.productVariant.findUnique({
    where: { id: request.params.id },
  });
  if (!variant?.filePath) {
    return fail(response, 404, 'Aucun fichier associe a cette variante');
  }
  return response.download(
    path.join(uploadRoot, variant.filePath),
    variant.fileName ?? 'fichier.xlsx',
  );
});
