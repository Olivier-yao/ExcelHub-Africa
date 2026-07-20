import type { Response } from 'express';

export function ok(response: Response, data: unknown, message = '', status = 200) {
  return response.status(status).json({ success: true, data, message });
}

export function fail(
  response: Response,
  status: number,
  message: string,
  errors: unknown[] = [],
) {
  return response.status(status).json({ success: false, message, errors });
}
