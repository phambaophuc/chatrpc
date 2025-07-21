import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from '@/services';

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
}
