import type { ApiResult } from "../../../../core/api/apiResult";
import type { SaveVideoReq } from "../entity/save_video_req";
import type { SemanticSearchRequest } from "../entity/semantic_search_request";
import type { SemanticSearchResponse } from "../entity/semantic_search_response";
import type { TopicsRequest } from "../entity/topics_request";
import type { VideoResponse } from "../entity/video_response";

export interface WatchVideoRepo {
  getTopics(topic: TopicsRequest): Promise<ApiResult<VideoResponse>>;
  getSearchResults(
    req: SemanticSearchRequest,
  ): Promise<ApiResult<SemanticSearchResponse[]>>;
  saveVideoProgress(req: SaveVideoReq): Promise<ApiResult<void>>;
}
