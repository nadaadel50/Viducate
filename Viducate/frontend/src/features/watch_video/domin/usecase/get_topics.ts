import { TopicsRequest } from "../entity/topics_request";
import type { WatchVideoRepo } from "../repository/watch_video_repo";

export class GetTopicsUseCase {
  private watchVideoRepo: WatchVideoRepo;
  constructor(watchVideoRepo: WatchVideoRepo) {
    this.watchVideoRepo = watchVideoRepo;
  }

  async getTopics(topicReq: TopicsRequest) {
    return this.watchVideoRepo.getTopics(topicReq);
  }
}
