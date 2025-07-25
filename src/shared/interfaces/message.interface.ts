import { MessageType } from '../entities';

export interface ISendMessageRequest {
  roomId: string;
  content: string;
  type?: MessageType;
  replyTo?: string;
}

export interface IMessageResponse {
  id: string;
  content: string;
  type: MessageType;
  userId: string;
  roomId: string;
  replyTo: string | null;
  isEdited: boolean;
  timestamp: string;
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
  replyToMessage?: {
    id: string;
    content: string;
    user: {
      username: string;
    };
  };
}
