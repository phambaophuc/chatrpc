import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '@/auth';
import { AuthGrpcController } from '@/controllers';
import { AuthResolver } from '@/graphql/resolvers';
import { UserRepository } from '@/repositories';
import { AuthService } from '@/services';
import { PrismaService } from '@/shared/services';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    UserRepository,
    JwtStrategy,
    PrismaService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  controllers: [AuthGrpcController],
  exports: [AuthService, UserRepository, PrismaService],
})
export class AuthModule {}
