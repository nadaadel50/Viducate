import type { SaveVideoReq } from "../entity/save_video_req";
import type { WatchVideoRepo } from "../repository/watch_video_repo";

export class SaveVideoProgressUseCase {
  private watchVideoRepo: WatchVideoRepo;
  constructor(watchVideoRepo: WatchVideoRepo) {
    this.watchVideoRepo = watchVideoRepo;
  }

  async saveVideoProgress(saveReq: SaveVideoReq) {
    return this.watchVideoRepo.saveVideoProgress(saveReq);
  }
}
