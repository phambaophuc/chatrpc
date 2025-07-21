import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '@/services';

import { JwtPayload } from './interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'jwt-secret',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: user.id, username: user.username };
  }
}
