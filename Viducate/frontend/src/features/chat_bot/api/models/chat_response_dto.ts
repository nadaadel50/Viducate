// chat_response_dto.ts

import type { ChatResponse } from "../../domain/entity/chat_response";

export type ChatResponseDto = {
  id: string;
  answer: string;
  created_at: number;
};

export function toChatResponse(dto: ChatResponseDto): ChatResponse {
  return {
    id: dto.id,
    answer: dto.answer,
    createdAt: dto.created_at,
  };
}
