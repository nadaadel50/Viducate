import type { SemanticSearchResponse } from "../../domin/entity/semantic_search_response";

export class SemanticSearchResponseDto {
  video_id: number;
  subtopic_id: number;
  title: string;
  sub_topic_name: string;
  sub_topic_description: string;
  start_time: number;
  score: number;

  constructor(data: SemanticSearchResponseDto) {
    this.video_id = data.video_id;
    this.subtopic_id = data.subtopic_id;
    this.title = data.title;
    this.sub_topic_name = data.sub_topic_name;
    this.sub_topic_description = data.sub_topic_description;
    this.start_time = data.start_time;
    this.score = data.score;
  }
}

export function toSemanticSearchResponse(
  dto: SemanticSearchResponseDto,
): SemanticSearchResponse {
  return {
    video_id: dto.video_id,
    subtopic_id: dto.subtopic_id,
    title: dto.title,
    sub_topic_name: dto.sub_topic_name,
    sub_topic_description: dto.sub_topic_description,
    start_time: dto.start_time,
    score: dto.score,
  };
}
