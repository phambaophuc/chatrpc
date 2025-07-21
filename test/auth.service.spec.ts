import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UserRepository } from '@/repositories';
import { AuthService } from '@/services';
import { User } from '@/shared/entities';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUserRepository = {
      findByUsername: jest.fn(),
      existsByUsername: jest.fn(),
      create: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
  });

  describe('login', () => {
    it('should return login response when credentials are valid', async () => {
      const user = new User(
        '1',
        'testuser',
        await User.hashPassword('password123'),
      );
      userRepository.findByUsername.mockResolvedValue(user);
      jwtService.sign.mockReturnValue('mock-token');

      const result = await service.login({
        username: 'testuser',
        password: 'password123',
      });

      expect(result).toEqual({
        userId: '1',
        token: 'mock-token',
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      userRepository.findByUsername.mockResolvedValue(null);

      await expect(
        service.login({ username: 'testuser', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      const newUser = new User(
        '2',
        'newuser',
        await User.hashPassword('password123'),
      );
      userRepository.existsByUsername.mockResolvedValue(false);
      userRepository.create.mockResolvedValue(newUser);
      jwtService.sign.mockReturnValue('mock-token');

      const result = await service.register({
        username: 'newuser',
        password: 'password123',
      });

      expect(result).toEqual({
        userId: '2',
        token: 'mock-token',
      });
    });

    it('should throw ConflictException when username already exists', async () => {
      userRepository.existsByUsername.mockResolvedValue(true);

      await expect(
        service.register({ username: 'existinguser', password: 'password123' }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
