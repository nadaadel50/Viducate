import { apiClient } from "../../../../core/api/apiClient";
import type { TopicRequestDto } from "../model/topic_request_dto";
import type { TopicResponseDto } from "../model/topic_response_dto";
import type { VideoResponseDto } from "../model/video_response_dto";

export class WatchVideoService {

 async getTopics(reqDto: TopicRequestDto): Promise<VideoResponseDto> {
 

  const response = await apiClient.get(`/segments/videos/${reqDto.video_id}`, {
   
  });

  return response.data;
}

}