import { Message, User } from '../entities';

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(username: string, hashedPassword: string): Promise<User>;
  existsByUsername(username: string): Promise<boolean>;
}

export interface IMessageRepository {
  create(userId: string, content: string): Promise<Message>;
  findByUserId(userId: string, limit?: number): Promise<Message[]>;
  findAll(limit?: number): Promise<Message[]>;
  findById(id: string): Promise<Message | null>;
}
