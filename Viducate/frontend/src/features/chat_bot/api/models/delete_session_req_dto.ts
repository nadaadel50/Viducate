import type { DeleteMessageRequest } from "../../domain/entity/delete_message_req";

export type DeleteMessageRequestDto = {
  video_id: number;

  session_id: number;
};

export function toDeleteMessageRequestDto(
  entity: DeleteMessageRequest,
): DeleteMessageRequestDto {
  return {
    video_id: entity.video_id,

    session_id: entity.session_id,
  };
}
