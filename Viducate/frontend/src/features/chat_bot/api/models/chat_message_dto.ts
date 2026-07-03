import type { ChatMessage } from "../../domain/entity/chat_message";

export type ChatMessageDto = {
  message_id: number;
  role: "user" | "assistant";
  content: string;
  time: number;
  created_at: string;
};

export function toChatMessage(dto: ChatMessageDto): ChatMessage {
  return {
    message_id: dto.message_id.toString(),
    role: dto.role,
    content: dto.content,
    time: dto.time,
    created_at: dto.created_at,
  };
}
