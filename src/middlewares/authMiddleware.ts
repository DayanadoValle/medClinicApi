import { Request, Response, NextFunction } from "express";

import { verifyToken, TokenPayload } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      message: "Token de autenticacao nao informado.",
    });
    return;
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({
      message: "Formato de token invalido. Utilize: Bearer <token>.",
    });
    return;
  }

  try {
    const payload = verifyToken(token);

    req.user = payload;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Token invalido ou expirado.",
    });
  }
}
