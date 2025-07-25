import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';

import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import { MessageType } from '@/shared/entities';

registerEnumType(MessageType, { name: 'MessageType' });

@InputType()
export class SendMessageInputDto {
  @Field()
  @IsString()
  roomId: string;

  @Field()
  @IsString()
  content: string;

  @Field(() => MessageType, { nullable: true })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  replyTo?: string;
}

@InputType()
export class GetMessagesInputDto {
  @Field()
  @IsString()
  roomId: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsPositive()
  limit?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  offset?: number;
}

@ObjectType()
export class MessageUserDto {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field(() => String, { nullable: true })
  avatar: string | null;
}

@ObjectType()
export class ReplyMessageUserDto {
  @Field()
  username: string;
}

@ObjectType()
export class ReplyMessageDto {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field(() => ReplyMessageUserDto)
  user: ReplyMessageUserDto;
}

@ObjectType()
export class MessageDto {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field(() => MessageType)
  type: MessageType;

  @Field()
  userId: string;

  @Field()
  roomId: string;

  @Field(() => String, { nullable: true })
  replyTo: string | null;

  @Field()
  isEdited: boolean;

  @Field()
  timestamp: string;

  @Field(() => MessageUserDto)
  user: MessageUserDto;

  @Field(() => ReplyMessageDto, { nullable: true })
  replyToMessage?: ReplyMessageDto;
}
