export interface IMessageRequest {
  userId: string;
  content: string;
}

export interface IMessageResponse {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
}

export interface IChatService {
  sendMessage(request: IMessageRequest): Promise<IMessageResponse>;
  getMessages(userId?: string, limit?: number): Promise<IMessageResponse[]>;
  streamMessages(userId: string): AsyncIterable<IMessageResponse>;
}
