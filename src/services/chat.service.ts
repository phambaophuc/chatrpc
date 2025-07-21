import { Observable, Subject } from 'rxjs';

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Message } from '@/shared/entities';
import {
  IChatService,
  IMessageRepository,
  IMessageRequest,
  IMessageResponse,
  IUserRepository,
} from '@/shared/interfaces';

@Injectable()
export class ChatService implements IChatService {
  private messageSubject = new Subject<IMessageResponse>();

  constructor(
    @Inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async sendMessage(request: IMessageRequest): Promise<IMessageResponse> {
    // Validate input
    if (!request.content?.trim()) {
      throw new BadRequestException('Message content cannot be empty');
    }

    // Validate user exists
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create message
    const message = await this.messageRepository.create(
      request.userId,
      request.content.trim(),
    );
    const response: IMessageResponse = message.toPlainObject();

    // Broadcast to all subscribers
    this.messageSubject.next(response);

    return response;
  }

  async getMessages(
    userId?: string,
    limit?: number,
  ): Promise<IMessageResponse[]> {
    let messages: Message | Message[];

    if (userId) {
      // Validate user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      messages = await this.messageRepository.findByUserId(userId, limit);
    } else {
      messages = await this.messageRepository.findAll(limit);
    }

    return messages
      .map((msg) => msg.toPlainObject())
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
  }

  async *streamMessages(userId: string): AsyncIterable<IMessageResponse> {
    // Validate user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Convert Subject to AsyncIterable
    const observable = this.messageSubject.asObservable();

    for await (const message of this.observableToAsyncIterable(observable)) {
      yield message;
    }
  }

  private async *observableToAsyncIterable<T>(
    observable: Observable<T>,
  ): AsyncIterable<T> {
    const buffer: T[] = [];
    let resolve: ((value: IteratorResult<T>) => void) | null = null;
    let isComplete = false;

    const subscription = observable.subscribe({
      next: (value) => {
        if (resolve) {
          resolve({ value, done: false });
          resolve = null;
        } else {
          buffer.push(value);
        }
      },
      complete: () => {
        isComplete = true;
        if (resolve) {
          resolve({ value: undefined, done: true });
          resolve = null;
        }
      },
    });

    try {
      while (!isComplete) {
        if (buffer.length > 0) {
          yield buffer.shift()!;
        } else {
          await new Promise<void>((res) => {
            resolve = (result) => {
              if (!result.done) {
                res();
              }
            };
          });
        }
      }
    } finally {
      subscription.unsubscribe();
    }
  }
}
