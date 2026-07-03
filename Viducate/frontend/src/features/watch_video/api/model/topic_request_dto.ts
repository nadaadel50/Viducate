import type { TopicsRequest } from "../../domin/entity/topics_request";

export type TopicRequestDto = {
  video_id: number;
};

export function toTopicRequestDto(entity: TopicsRequest): TopicRequestDto {
  return {
    video_id: entity.videoId,
  };
}
