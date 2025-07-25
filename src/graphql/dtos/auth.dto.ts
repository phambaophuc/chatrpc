import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

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

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;
}

@ObjectType()
export class UserDto {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => String, { nullable: true })
  avatar: string | null;
}

@ObjectType()
export class LoginResponseDto {
  @Field()
  userId: string;

  @Field()
  token: string;

  @Field(() => UserDto)
  user: UserDto;
}
