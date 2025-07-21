import { Observable } from 'rxjs';

import { Controller } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';

import { ChatService } from '@/services';
import { IMessageRequest, IMessageResponse } from '@/shared/interfaces';

@Controller()
export class ChatGrpcController {
  constructor(private readonly chatService: ChatService) {}

  @GrpcMethod('ChatService', 'SendMessage')
  async sendMessage(request: IMessageRequest): Promise<IMessageResponse> {
    return await this.chatService.sendMessage(request);
  }

  @GrpcMethod('ChatService', 'GetMessages')
  async getMessages(request: {
    userId?: string;
    limit?: number;
  }): Promise<IMessageResponse[]> {
    return this.chatService.getMessages(request.userId, request.limit);
  }

  @GrpcStreamMethod('ChatService', 'StreamMessages')
  streamMessages(request: { userId: string }): Observable<IMessageResponse> {
    return new Observable<IMessageResponse>((observer) => {
      const streamMessages = async () => {
        try {
          for await (const message of this.chatService.streamMessages(
            request.userId,
          )) {
            observer.next(message);
          }
        } catch (error) {
          observer.error(error);
        }
      };
      void streamMessages();
    });
  }
}
