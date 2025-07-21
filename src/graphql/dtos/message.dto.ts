import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class SendMessageInputDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  content: string;
}

@InputType()
export class GetMessagesInputDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  userId?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsPositive()
  limit?: number;
}

@ObjectType()
export class MessageDto {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  content: string;

  @Field()
  timestamp: string;
}
