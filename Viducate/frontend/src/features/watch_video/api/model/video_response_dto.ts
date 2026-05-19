import { SubTopic } from "../../domin/entity/sub_topic";
import { TopicResponse } from "../../domin/entity/topic_response";
import { VideoResponse } from "../../domin/entity/video_response";
import type { TopicResponseDto } from "./topic_response_dto";

export type VideoResponseDto = {
  video_id: number;
  video_url: string;
  segments: TopicResponseDto[];
  title: string;
  current_time: number;
  last_watched_at: string;
  bookmarks: number[];
};

export const mapVideoDtoToEntity = (dto: VideoResponseDto): VideoResponse => {
  return new VideoResponse(
    dto.video_url,
    dto.video_id,
    dto.title,
    dto.current_time,
    dto.last_watched_at,
    dto.bookmarks,
    dto.segments.map(
      (topic) =>
        new TopicResponse(
          topic.segment_id,
          topic.segment_number,
          topic.start_time,
          topic.end_time,
          topic.main_topic,
          topic.title,
          topic.is_completed,
          topic.sub_topics.map(
            (subTopic) => new SubTopic(subTopic.name, subTopic.start_time),
          ),
        ),
    ),
  );
};
