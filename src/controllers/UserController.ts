import { Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

export class UserController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  me = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const profile = await this.authService.getProfile(userId);

      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };
}
