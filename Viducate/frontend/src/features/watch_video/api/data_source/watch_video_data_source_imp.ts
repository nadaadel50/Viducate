import type { WatchVideoDataSource } from "../../data/data_source/watch_video_data_source";
import type { WatchVideoService } from "../client/watch_video_service";
import type { TopicsRequest } from "../../domin/entity/topics_request";
import { toTopicRequestDto } from "../model/topic_request_dto";
import type { ApiResult } from "../../../../core/api/apiResult";

import handleApiError from "../../../../core/api/apiError";
import type { VideoResponse } from "../../domin/entity/video_response";
import { mapVideoDtoToEntity } from "../model/video_response_dto";
import type { SemanticSearchRequest } from "../../domin/entity/semantic_search_request";
import type { SemanticSearchResponse } from "../../domin/entity/semantic_search_response";
import { toSearchRequestDto } from "../model/semantic_search_request_dto";
import { toSemanticSearchResponse } from "../model/semantic_search_response_dto";
import type { SaveVideoReq } from "../../domin/entity/save_video_req";
import { mapSaveVideoReqToDto } from "../model/save_req_dto";

export class WatchVideoDataSourceImp implements WatchVideoDataSource {
  private watchVideoService: WatchVideoService;
  constructor(watchVideoService: WatchVideoService) {
    this.watchVideoService = watchVideoService;
  }
  async saveVideoProgress(req: SaveVideoReq): Promise<ApiResult<void>> {
    try {
    
      await this.watchVideoService.saveVideoProgress(mapSaveVideoReqToDto(req));

      return {
        success: true,
        data: undefined,
      };
    } catch (error: any) {
      const message = handleApiError(error);
     
     
      return { success: false, error: message };
    }
  }

  async getTopics(topicReq: TopicsRequest): Promise<ApiResult<VideoResponse>> {
    try {
      const response = await this.watchVideoService.getTopics(
        toTopicRequestDto(topicReq),
      );

      const responseEntity = mapVideoDtoToEntity(response);

      return {
        success: true,
        data: responseEntity,
      };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }

  async getSearchResults(
    req: SemanticSearchRequest,
  ): Promise<ApiResult<SemanticSearchResponse[]>> {
    try {
      const response = await this.watchVideoService.getSearchResult(
        toSearchRequestDto(req),
      );

      const responseEntity = response.results.map(toSemanticSearchResponse);

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
