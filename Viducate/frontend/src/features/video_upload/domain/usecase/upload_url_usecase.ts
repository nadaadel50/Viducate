import type { UrlRequest } from "../entity/url_request";
import type { UploadVideoRepo } from "../repository/upload_video_rep";

export class UploadUrlUseCase {
  private uploadVideoRepo: UploadVideoRepo;
  constructor(uploadVideoRepo: UploadVideoRepo) {
    this.uploadVideoRepo = uploadVideoRepo;
  }

  async uploadUrl(urlReq: UrlRequest) {
    return this.uploadVideoRepo.uploadURL(urlReq);
  }
}
