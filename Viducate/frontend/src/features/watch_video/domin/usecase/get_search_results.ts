import type { SemanticSearchRequest } from "../entity/semantic_search_request";
import type { WatchVideoRepo } from "../repository/watch_video_repo";

export class GetSearchResultUseCase {
  private watchVideoRepo: WatchVideoRepo;
  constructor(watchVideoRepo: WatchVideoRepo) {
    this.watchVideoRepo = watchVideoRepo;
  }

  async getSearchResults(req: SemanticSearchRequest) {
    return this.watchVideoRepo.getSearchResults(req);
  }
}
