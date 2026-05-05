import { SemanticSearchResponse } from "../../domin/entity/semantic_search_response";

export type SemanticSearchResponseDto = {
  segment_number: number;
  start_time: string;
  end_time: string;
  main_topic: string;
  title: string;
  sub_topic_name: string;
  score: number;
};
export const mapSemanticSearchList = (
  dtos: SemanticSearchResponseDto[]
): SemanticSearchResponse[] => {
  return dtos.map(mapSemanticSearchDtoToEntity);
};

 const mapSemanticSearchDtoToEntity = (
  dto: SemanticSearchResponseDto,
): SemanticSearchResponse => {
  return new SemanticSearchResponse(
    dto.segment_number,
    dto.start_time,
    dto.end_time,
    dto.main_topic,
    dto.title,
    dto.sub_topic_name,
  );
};
