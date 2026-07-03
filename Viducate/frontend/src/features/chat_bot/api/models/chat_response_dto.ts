import type { ChatResponse } from "../../domain/entity/chat_response";

export type ChatResponseDto = {
  session: {
    session_id: number;
    title: string;
  };

  message: {
    message_id: number;
    content: string;
  };
};

export function toChatResponse(dto: ChatResponseDto): ChatResponse {
  return {
    session: {
      id: dto.session.session_id,
      title: dto.session.title,
    },
    message: {
      content: dto.message.content,
      message_id: dto.message.message_id.toString(),
    },
  };
}
