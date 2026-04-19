import type { ApiResult } from "../../../../core/api/apiResult";
import type { TopicResponse } from "../../domin/entity/topic_response";
import type { TopicsRequest } from "../../domin/entity/topics_request";


export interface WatchVideoDataSource {
 getTopics(topicReq: TopicsRequest): Promise<ApiResult<TopicResponse[]>>;
}


