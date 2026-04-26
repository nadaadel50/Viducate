import type { ApiResult } from "../../../../core/api/apiResult";
import type { TopicsRequest } from "../entity/topics_request";
import type { VideoResponse } from "../entity/video_response";

export interface WatchVideoRepo {

    getTopics(topic: TopicsRequest): Promise<ApiResult<VideoResponse>>;

}