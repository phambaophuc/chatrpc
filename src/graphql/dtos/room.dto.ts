import { IsEnum, IsOptional, IsString } from 'class-validator';

import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import { RoomMemberRole, RoomType } from '@/shared/entities';

import { UserDto } from './auth.dto';

registerEnumType(RoomType, { name: 'RoomType' });
registerEnumType(RoomMemberRole, { name: 'RoomMemberRole' });

@InputType()
export class CreateRoomInputDto {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => RoomType)
  @IsEnum(RoomType)
  type: RoomType;
}

@InputType()
export class JoinRoomInputDto {
  @Field()
  @IsString()
  roomId: string;
}

@ObjectType()
export class RoomDto {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => RoomType)
  type: RoomType;

  @Field(() => String, { nullable: true })
  avatar: string | null;

  @Field()
  creatorId: string;

  @Field()
  isActive: boolean;

  @Field(() => Int)
  memberCount: number;

  @Field(() => Int, { nullable: true })
  unreadCount?: number;

  @Field()
  createdAt?: string;

  @Field()
  updatedAt?: string;
}

@ObjectType()
export class RoomMemberDto {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  roomId: string;

  @Field(() => RoomMemberRole)
  role: RoomMemberRole;

  @Field()
  joinedAt: Date;

  @Field(() => UserDto)
  user: UserDto;
}
