import bcrypt from 'bcryptjs';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import type { AuthPayload } from '../middleware/auth.js';
import { fail, ok } from '../utils/http.js';

export const authRouter = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Mot de passe: 8 caracteres minimum'),
});

const registerSchema = credentialsSchema.extend({
  name: z.string().min(2),
});

function signTokens(payload: AuthPayload) {
  return {
    accessToken: jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' }),
    refreshToken: jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' }),
  };
}

authRouter.post('/register', async (request, response) => {
  const parsed = registerSchema.safeParse(request.body);
  if (!parsed.success) {
    return fail(response, 400, 'Donnees invalides', parsed.error.issues);
  }

  const { email, password, name } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return fail(response, 409, 'Un compte existe deja avec cet email');
  }

  const user = await prisma.user.create({
    data: { email, name, passwordHash: await bcrypt.hash(password, 12) },
  });

  const payload: AuthPayload = { sub: user.id, role: user.role, email: user.email };
  return ok(
    response,
    {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      ...signTokens(payload),
    },
    'Compte cree',
    201,
  );
});

authRouter.post('/login', async (request, response) => {
  const parsed = credentialsSchema.safeParse(request.body);
  if (!parsed.success) {
    return fail(response, 400, 'Donnees invalides', parsed.error.issues);
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  const valid = user && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!valid) {
    return fail(response, 401, 'Email ou mot de passe incorrect');
  }

  const payload: AuthPayload = { sub: user.id, role: user.role, email: user.email };
  return ok(
    response,
    {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      ...signTokens(payload),
    },
    'Connexion reussie',
  );
});

authRouter.post('/refresh', (request, response) => {
  const schema = z.object({ refreshToken: z.string().min(1) });
  const parsed = schema.safeParse(request.body);
  if (!parsed.success) {
    return fail(response, 400, 'refreshToken requis');
  }

  try {
    const decoded = jwt.verify(
      parsed.data.refreshToken,
      env.JWT_REFRESH_SECRET,
    ) as AuthPayload;
    const payload: AuthPayload = {
      sub: decoded.sub,
      role: decoded.role,
      email: decoded.email,
    };
    return ok(response, signTokens(payload), 'Jetons renouveles');
  } catch {
    return fail(response, 401, 'Jeton de rafraichissement invalide');
  }
});
