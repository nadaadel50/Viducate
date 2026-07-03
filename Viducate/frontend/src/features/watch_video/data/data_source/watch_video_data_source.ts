import type { ApiResult } from "../../../../core/api/apiResult";
import type { SaveVideoReq } from "../../domin/entity/save_video_req";
import type { SemanticSearchRequest } from "../../domin/entity/semantic_search_request";
import type { SemanticSearchResponse } from "../../domin/entity/semantic_search_response";
import type { TopicsRequest } from "../../domin/entity/topics_request";
import type { VideoResponse } from "../../domin/entity/video_response";

export interface WatchVideoDataSource {
  getTopics(topicReq: TopicsRequest): Promise<ApiResult<VideoResponse>>;
  getSearchResults(
    req: SemanticSearchRequest,
  ): Promise<ApiResult<SemanticSearchResponse[]>>;
  saveVideoProgress(req: SaveVideoReq): Promise<ApiResult<void>>;
}
