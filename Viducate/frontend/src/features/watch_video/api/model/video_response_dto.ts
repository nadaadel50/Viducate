import { TopicResponse } from "../../domin/entity/topic_response";
import { VideoResponse } from "../../domin/entity/video_response";
import type { TopicResponseDto } from "./topic_response_dto";

export type VideoResponseDto = {
  video_id: number;
  video_url: string;
  segments: TopicResponseDto[];
};



export const mapVideoDtoToEntity = (
  dto: VideoResponseDto
): VideoResponse => {
  return new VideoResponse(
    dto.video_url,
    dto.video_id,
    dto.segments.map(
      (topic) =>
        new TopicResponse(
            topic.end_time,
            topic.start_time,
            topic.segment_id,
            topic.segment_number,
            topic.main_topic,
            topic.title
         
    
        )
    )
  );
};