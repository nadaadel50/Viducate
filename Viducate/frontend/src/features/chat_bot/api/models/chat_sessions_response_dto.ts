import type { ChatSession } from "../../domain/entity/chat_session";

export type ChatSessionDto = {
  id: number;
  title: string;
  created_at: string;
  last_message_at: string;
};

export function toChatSession(dto: ChatSessionDto): ChatSession {
  return {
    id: dto.id,
    title: dto.title,
    created_at: new Date(dto.created_at),

    last_message_at: new Date(dto.last_message_at),
  };
}
