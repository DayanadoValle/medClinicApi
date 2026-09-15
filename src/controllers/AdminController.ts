import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class AdminController {
  ping = (req: AuthenticatedRequest, res: Response): void => {
    res.status(200).json({
      message: 'Acesso autorizado: voce esta logado como Administrador.',
      userId: req.user?.id,
    });
  };
}
