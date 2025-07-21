import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class LoginInputDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;
}

@InputType()
export class RegisterInputDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;
}

@ObjectType()
export class LoginResponseDto {
  @Field()
  userId: string;

  @Field()
  token: string;
}

@ObjectType()
export class UserDto {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  createdAt: Date;
}
