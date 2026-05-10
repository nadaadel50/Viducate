// chat_response_dto.ts

import type { ChatResponse } from "../../domain/entity/chat_response";

export type ChatResponseDto = {
  session: {
    id: number;
    title: string;
  };

  message: {
    answer: string;
  };
};

export function toChatResponse(dto: ChatResponseDto): ChatResponse {
  return {
    session: {
      id: dto.session.id,
      title: dto.session.title,
    },
    message: {
      answer: dto.message.answer,
    },
  };
}
