import type { SessionMessagesRequest } from "../../domain/entity/all_chat_messages_req";

export type AllSessionMessagesRequestDto = {
  video_id: number;
  session_id: number;
};

export function toAllSessionMessagesRequestDto(
  request: SessionMessagesRequest,
): AllSessionMessagesRequestDto {
  return {
    video_id: request.video_id,
    session_id: request.session_id,
  };
}
