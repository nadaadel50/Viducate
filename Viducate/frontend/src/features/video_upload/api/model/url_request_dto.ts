import type { UrlRequest } from "../../domain/entity/url_request";

export type UrlRequestDto = {
  url: string;
  title: string;
  language: string;
  subject: string;
};

export function toUrlRequestDto(entity: UrlRequest): UrlRequestDto {
  return {
    url: entity.url,
    title: entity.title,
    language: entity.language,
    subject: entity.subject,
  };
}
