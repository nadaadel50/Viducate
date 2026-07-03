import type { UserAsk } from "../../domain/entity/user_ask";

export type ChatRequestDto = {
  video_id: number;
  session_id?: number | null;
  question: string;
  current_time?: number;
};

export function toChatRequestDto(request: UserAsk): ChatRequestDto {
  return {
    video_id: request.videoId,
    session_id: request.session_id,
    question: request.question,
    current_time: request.currentTime,
  };
}
