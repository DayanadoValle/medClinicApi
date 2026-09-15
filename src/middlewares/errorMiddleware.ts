import { Request, Response, NextFunction } from 'express';

import { AppError } from '../utils/AppError';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,

  _: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  console.error('[ErrorMiddleware] Erro nao tratado:', err);

  res.status(500).json({ message: 'Erro interno no servidor.' });
}

export function notFoundMiddleware(req: Request, res: Response): void {
  res
    .status(404)
    .json({ message: `Rota ${req.method} ${req.originalUrl} nao encontrada.` });
}
