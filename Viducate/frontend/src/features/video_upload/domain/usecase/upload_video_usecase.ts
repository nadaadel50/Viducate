import type { UploadVideoRequest } from "../entity/upload_video_request";
import type { UploadVideoRepo } from "../repository/upload_video_rep";

export class UploadVideoUseCase {
  private uploadVideoRepo: UploadVideoRepo;
  constructor(uploadVideoRepo: UploadVideoRepo) {
    this.uploadVideoRepo = uploadVideoRepo;
  }

  async uploadVideo(uploadReq:UploadVideoRequest){
    return this.uploadVideoRepo.uploadVideo(uploadReq)
  }
}
