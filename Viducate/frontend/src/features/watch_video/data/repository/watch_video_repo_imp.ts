import type { ApiResult } from "../../../../core/api/apiResult";
import type { SaveVideoReq } from "../../domin/entity/save_video_req";
import type { SemanticSearchRequest } from "../../domin/entity/semantic_search_request";
import type { SemanticSearchResponse } from "../../domin/entity/semantic_search_response";
import type { TopicsRequest } from "../../domin/entity/topics_request";
import type { VideoResponse } from "../../domin/entity/video_response";
import type { WatchVideoRepo } from "../../domin/repository/watch_video_repo";
import type { WatchVideoDataSource } from "../data_source/watch_video_data_source";

export class WatchVideoRepoImp implements WatchVideoRepo {
  private watchVideoDataSource: WatchVideoDataSource;

  constructor(watchVideoDs: WatchVideoDataSource) {
    this.watchVideoDataSource = watchVideoDs;
  }
  saveVideoProgress(req: SaveVideoReq): Promise<ApiResult<void>> {
    return this.watchVideoDataSource.saveVideoProgress(req);
  }
  getSearchResults(
    req: SemanticSearchRequest,
  ): Promise<ApiResult<SemanticSearchResponse[]>> {
    return this.watchVideoDataSource.getSearchResults(req);
  }
  getTopics(topic: TopicsRequest): Promise<ApiResult<VideoResponse>> {
    return this.watchVideoDataSource.getTopics(topic);
  }
}
