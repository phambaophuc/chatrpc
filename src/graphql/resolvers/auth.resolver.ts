import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '@/auth';
import { AuthService } from '@/services';
import { CurrentUser } from '@/shared/decorators';

import { LoginInputDto, LoginResponseDto, RegisterInputDto } from '../dtos';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponseDto)
  async login(@Args('input') input: LoginInputDto): Promise<LoginResponseDto> {
    return await this.authService.login(input);
  }

  @Mutation(() => LoginResponseDto)
  async register(
    @Args('input') input: RegisterInputDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.register(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async logout(@CurrentUser() user: any): Promise<boolean> {
    await this.authService.updateUserStatus(user.userId, false);
    return true;
  }
}
