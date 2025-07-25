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

    await this.updateUserStatus(user.id, true);

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      email: user.email,
    });

    return {
      userId: user.id,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

  async register(request: IRegisterRequest): Promise<ILoginResponse> {
    if (await this.userRepository.existsByUsername(request.username)) {
      throw new ConflictException('Username already exists');
    }

    if (
      request.email &&
      (await this.userRepository.existsByEmail(request.email))
    ) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await User.hashPassword(request.password);
    const user = await this.userRepository.create(
      request.username,
      request.email || null,
      hashedPassword,
    );

    await this.updateUserStatus(user.id, true);

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      email: user.email,
    });

    return {
      userId: user.id,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

  async updateUserStatus(userId: string, isOnline: boolean): Promise<void> {
    await this.userRepository.updateUserStatus(userId, isOnline);
  }

  async validateUser(userId: string): Promise<User | null> {
    return await this.userRepository.findById(userId);
  }
}
