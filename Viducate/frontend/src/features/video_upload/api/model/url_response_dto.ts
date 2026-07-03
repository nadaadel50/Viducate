import { UrlResponse } from "../../domain/entity/url_response";

export type UrlResponseDto = {
  video_id: number;
  title: string;
  url: string;
  language: string;
  processing_status: string;
  message: string;
};

export function toUrlResponse(dto: UrlResponseDto): UrlResponse {
  return new UrlResponse(
    dto.video_id,
    dto.title,
    dto.url,
    dto.language,
    dto.processing_status,
    dto.message,
  );
}
