import { UserRepository } from "../repositories/UserRepository";
import {
  CreateUserDTO,
  LoginDTO,
  AuthResponseDTO,
  UserResponseDTO,
} from "../dtos/user.dto";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { UserRole } from "../entities/UserRole";
import { User } from "../entities/User";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toUserResponse(user: User): UserResponseDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export class AuthService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: CreateUserDTO): Promise<UserResponseDTO> {
    const { name, email, password, role } = data;

    if (!name || !email || !password) {
      throw new AppError("Nome, e-mail e senha sao obrigatorios.", 400);
    }

    if (!EMAIL_REGEX.test(email)) {
      throw new AppError("Formato de e-mail invalido.", 400);
    }

    if (password.length < 6) {
      throw new AppError("A senha deve possuir no minimo 6 caracteres.", 400);
    }

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError(
        "Ja existe um usuario cadastrado com este e-mail.",
        409
      );
    }

    const hashedPassword = await hashPassword(password);

    const createdUser = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: role ?? UserRole.ATENDENTE,
    });

    return toUserResponse(createdUser);
  }

  async login(data: LoginDTO): Promise<AuthResponseDTO> {
    const { email, password } = data;

    if (!email || !password) {
      throw new AppError("E-mail e senha sao obrigatorios.", 400);
    }

    const user = await this.userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new AppError("Credenciais invalidas.", 401);
    }

    const passwordMatches = await comparePassword(password, user.password);

    if (!passwordMatches) {
      throw new AppError("Credenciais invalidas.", 401);
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    return {
      token,
      user: toUserResponse(user),
    };
  }

  async getProfile(userId: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("Usuario nao encontrado.", 404);
    }

    return toUserResponse(user);
  }
}
