import { ConfirmUploadResponse } from "../../domain/entity/confirm_upload_response";
export type ConfirmUploadResponseDto = {
  video_id: number;
  title: string;
  message: string;
  processing_status: string;
};

export function toConfirmEntity(
  dto: ConfirmUploadResponseDto,
): ConfirmUploadResponse {
  return {
    videoId: dto.video_id,
    title: dto.title,
    message: dto.message,
    processing_status: dto.processing_status,
  };
}
