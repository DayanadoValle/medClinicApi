import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import { CreateUserDTO, LoginDTO } from "../dtos/user.dto";

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = req.body as CreateUserDTO;
      const user = await this.authService.register(data);

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = req.body as LoginDTO;
      const result = await this.authService.login(data);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
