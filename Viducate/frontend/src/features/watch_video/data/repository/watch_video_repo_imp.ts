
import type { ApiResult } from "../../../../core/api/apiResult";
import type { TopicsRequest } from "../../domin/entity/topics_request";
import type { VideoResponse } from "../../domin/entity/video_response";
import type { WatchVideoRepo } from "../../domin/repository/watch_video_repo";
import type { WatchVideoDataSource } from "../data_source/watch_video_data_source";


export class WatchVideoRepoImp implements WatchVideoRepo {
  private watchVideoDataSource: WatchVideoDataSource;

  constructor(watchVideoDs: WatchVideoDataSource) {
    this.watchVideoDataSource = watchVideoDs;
  }
    getTopics(topic: TopicsRequest): Promise<ApiResult<VideoResponse>> {
    return this.watchVideoDataSource.getTopics(topic);
    }
 
  
}