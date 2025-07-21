import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '@/shared/entities';
import {
  IAuthService,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IUserRepository,
} from '@/shared/interfaces';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(request: ILoginRequest): Promise<ILoginResponse> {
    const user = await this.userRepository.findByUsername(request.username);

    if (!user || !(await user.validatePassword(request.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return {
      userId: user.id,
      token,
    };
  }

  async register(request: IRegisterRequest): Promise<ILoginResponse> {
    const existingUser = await this.userRepository.existsByUsername(
      request.username,
    );

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await User.hashPassword(request.password);
    const user = await this.userRepository.create(
      request.username,
      hashedPassword,
    );

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return {
      userId: user.id,
      token,
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return await this.userRepository.findById(userId);
  }
}
