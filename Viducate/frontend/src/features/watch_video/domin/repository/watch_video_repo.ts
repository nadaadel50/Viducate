import type { ApiResult } from "../../../../core/api/apiResult";
import type { TopicResponse } from "../entity/topic_response";
import type { TopicsRequest } from "../entity/topics_request";

export interface WatchVideoRepo {

    getTopics(topic: TopicsRequest): Promise<ApiResult<TopicResponse[]>>;

}