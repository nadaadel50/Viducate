import type { SemanticSearchRequest } from "../../domin/entity/semantic_search_request";

export type SemanticSearchRequestDto = {
  query: string;
  videoId: number;
};

export function toSearchRequestDto(
  entity: SemanticSearchRequest,
): SemanticSearchRequestDto {
  return {
    query: entity.query,
    videoId: entity.videoId,
  };
}
