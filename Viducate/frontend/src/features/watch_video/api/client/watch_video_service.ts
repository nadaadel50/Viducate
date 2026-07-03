import { apiClient } from "../../../../core/api/apiClient";
import type { SaveVideoReqDto } from "../model/save_req_dto";
import type { SematicResults } from "../model/semantic_result";
import type { SemanticSearchRequestDto } from "../model/semantic_search_request_dto";
import type { TopicRequestDto } from "../model/topic_request_dto";
import type { VideoResponseDto } from "../model/video_response_dto";

export class WatchVideoService {
  async getTopics(reqDto: TopicRequestDto): Promise<VideoResponseDto> {
    const response = await apiClient.get(
      `/segments/videos/${reqDto.video_id}`,
      {},
    );
   

    return response.data;
  }

  async getSearchResult(
    reqDto: SemanticSearchRequestDto,
  ): Promise<SematicResults> {
    const response = await apiClient.post(
      `/semantic_search/video/${reqDto.videoId}/search`,
      {
        query: reqDto.query,
      },
    );

    return response.data;
  }

  async saveVideoProgress(reqDto: SaveVideoReqDto): Promise<void> {
    await apiClient.post(`/videos/${reqDto.video_id}/save`, {
      video_id: reqDto.video_id,
      completed_segment_ids: reqDto.completed_segment_ids,
      bookmarks: reqDto.bookmarks,
      current_time: reqDto.current_time,
      duration: reqDto.duration,
    });
  }
}
