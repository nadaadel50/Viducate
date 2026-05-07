import type { ChatRequest } from "../../domain/entity/chat_req";


export type ChatRequestDto = {
  
  video_id: number;
  question: string;
  current_time?: number;
};

export function toChatRequestDto(
  request: ChatRequest,
): ChatRequestDto {
  return {
  
    video_id: request.videoId,
    question: request.question,
    current_time: request.currentTime,
  };
}