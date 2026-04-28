import type { ApiResult } from "../../../../core/api/apiResult";
import type { TopicsRequest } from "../../domin/entity/topics_request";
import type { VideoResponse } from "../../domin/entity/video_response";


export interface WatchVideoDataSource {
 getTopics(topicReq: TopicsRequest): Promise<ApiResult<VideoResponse>>;
}


