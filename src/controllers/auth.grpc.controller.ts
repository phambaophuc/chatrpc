import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { AuthService } from '@/services';
import {
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
} from '@/shared/interfaces';

@Controller()
export class AuthGrpcController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Login')
  async login(request: ILoginRequest): Promise<ILoginResponse> {
    return await this.authService.login(request);
  }

  @GrpcMethod('AuthService', 'Register')
  async register(request: IRegisterRequest): Promise<ILoginResponse> {
    return await this.authService.register(request);
  }
}
