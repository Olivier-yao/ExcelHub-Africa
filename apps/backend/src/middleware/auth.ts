import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { fail } from '../utils/http.js';

export type AuthPayload = {
  sub: string;
  role: 'ADMIN' | 'CUSTOMER';
  email: string;
};

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthPayload;
  }
}

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return fail(response, 401, 'Authentification requise');
  }

  try {
    const payload = jwt.verify(header.slice(7), env.JWT_SECRET) as AuthPayload;
    request.user = payload;
    return next();
  } catch {
    return fail(response, 401, 'Jeton invalide ou expire');
  }
}

export function requireAdmin(request: Request, response: Response, next: NextFunction) {
  if (request.user?.role !== 'ADMIN') {
    return fail(response, 403, 'Acces reserve aux administrateurs');
  }
  return next();
}
