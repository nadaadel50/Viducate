import type { WatchVideoDataSource } from "../../data/data_source/watch_video_data_source";
import type { WatchVideoService } from "../client/watch_video_service";
import type { TopicResponse } from "../../domin/entity/topic_response";
import type { TopicsRequest } from "../../domin/entity/topics_request";
import { toTopicRequestDto } from "../model/topic_request_dto";
import type { ApiResult } from "../../../../core/api/apiResult";

import handleApiError from "../../../../core/api/apiError";
import type { VideoResponse } from "../../domin/entity/video_response";
import { mapVideoDtoToEntity } from "../model/video_response_dto";

export class WatchVideoDataSourceImp implements WatchVideoDataSource {
  private watchVideoService: WatchVideoService;
  constructor(watchVideoService: WatchVideoService) {
    this.watchVideoService = watchVideoService;
  }
  async getTopics(
    topicReq: TopicsRequest,
  ): Promise<ApiResult<VideoResponse>> {

   
    try {
      const response = await this.watchVideoService.getTopics(
        toTopicRequestDto(topicReq),
      );
      // console.log("iam here")
      // console.log(response)
      const responseEntity = mapVideoDtoToEntity(response)
    
      return {
        success: true,
        data: responseEntity,
      };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }
}
