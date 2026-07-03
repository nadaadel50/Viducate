import type { UploadVideoRequest } from "../entity/upload_video_request";
import type { UploadVideoRepo } from "../repository/upload_video_rep";

export class UploadVideoUseCase {
  private uploadVideoRepo: UploadVideoRepo;
  constructor(uploadVideoRepo: UploadVideoRepo) {
    this.uploadVideoRepo = uploadVideoRepo;
  }

  async uploadVideo(
    uploadReq: UploadVideoRequest,
    onProgress?: (percent: number) => void,
    signal?: AbortSignal,
    onVideoIdReceived?: (id: number) => void,
  ) {
    const response = await this.uploadVideoRepo.uploadVideo(
      uploadReq,
      onProgress,
      signal,
      onVideoIdReceived,
    );
    if (!response.success) return response;

    return response;
  }
}
