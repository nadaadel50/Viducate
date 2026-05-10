// chat_session_dto.ts

import type { ChatSession } 
from "../../domain/entity/chat_session";

export type ChatSessionDto = {
  id: number;
  title: string;
  created_at: number;
  last_message_at: number;
};

export function toChatSession(
  dto: ChatSessionDto,
): ChatSession {
  return {
    id: dto.id,
    title: dto.title,
    created_at: dto.created_at,
    last_message_at: dto.last_message_at,
  };
}