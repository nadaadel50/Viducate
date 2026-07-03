import type { UploadVideoRepo } from "../repository/upload_video_rep";

export class DeleteVideoUseCase {
  private uploadVideoRepo: UploadVideoRepo;
  constructor(uploadVideoRepo: UploadVideoRepo) {
    this.uploadVideoRepo = uploadVideoRepo;
  }

  async deleteVideo(videoId: number) {
    return this.uploadVideoRepo.deleteVideo(videoId);
  }
}
