import bcrypt from 'bcryptjs';
import { Router } from 'express';
import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import type { AuthPayload } from '../middleware/auth.js';
import { fail, ok } from '../utils/http.js';

export const authRouter = Router();

const REFRESH_COOKIE = 'refreshToken';
const REFRESH_COOKIE_PATH = '/api/v1/auth';
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

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

function setRefreshCookie(response: Response, refreshToken: string) {
  response.cookie(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: REFRESH_COOKIE_PATH,
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
}

function serializeUser(user: { id: string; email: string; name: string; role: string }) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
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
  const tokens = signTokens(payload);
  setRefreshCookie(response, tokens.refreshToken);
  return ok(
    response,
    { user: serializeUser(user), accessToken: tokens.accessToken },
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
  const tokens = signTokens(payload);
  setRefreshCookie(response, tokens.refreshToken);
  return ok(
    response,
    { user: serializeUser(user), accessToken: tokens.accessToken },
    'Connexion reussie',
  );
});

authRouter.post('/refresh', async (request, response) => {
  const refreshToken = request.cookies?.[REFRESH_COOKIE];
  if (!refreshToken) {
    return fail(response, 401, 'Session expiree');
  }

  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as AuthPayload;
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) {
      return fail(response, 401, 'Session expiree');
    }

    const payload: AuthPayload = { sub: user.id, role: user.role, email: user.email };
    const tokens = signTokens(payload);
    setRefreshCookie(response, tokens.refreshToken);
    return ok(
      response,
      { user: serializeUser(user), accessToken: tokens.accessToken },
      'Jetons renouveles',
    );
  } catch {
    return fail(response, 401, 'Jeton de rafraichissement invalide');
  }
});

authRouter.post('/logout', (_request, response) => {
  response.clearCookie(REFRESH_COOKIE, { path: REFRESH_COOKIE_PATH });
  return ok(response, null, 'Deconnexion reussie');
});
