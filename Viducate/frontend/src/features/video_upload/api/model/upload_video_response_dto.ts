import type { UploadVideoResponse } from "../../domain/entity/upload_video_response";

export type UploadVideoResponseDTO = {
  video_id: number;
  title: string;
  upload_url: string;
  s3_key: string;
  processing_status: string;
  message: string;
};

export function toUploadVideoResponseEntity(
  dto: UploadVideoResponseDTO,
): UploadVideoResponse {
  return {
    video_id: dto.video_id,
    title: dto.title,
    upload_url: dto.upload_url,
    s3_key: dto.s3_key,
    processing_status: dto.processing_status,
    message: dto.message,
  };
}
