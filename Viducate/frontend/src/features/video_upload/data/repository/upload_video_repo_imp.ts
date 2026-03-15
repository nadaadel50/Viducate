import type { ApiResult } from "../../../../core/api/apiResult";
import type { ConfirmUploadResponse } from "../../domain/entity/confirm_upload_response";
import type { UploadVideoRequest } from "../../domain/entity/upload_video_request";
import type { UploadVideoRepo } from "../../domain/repository/upload_video_rep";
import type { UploadVideoDataSource } from "../dataSource/upload_video_dataSource";

export class uploadVideoRepoImp implements UploadVideoRepo {
  private uploadVideoDataSource: UploadVideoDataSource;

  constructor(uploadVideoDs: UploadVideoDataSource) {
    this.uploadVideoDataSource = uploadVideoDs;
  }
  uploadVideo(
    uploadReq: UploadVideoRequest,
    onProgress?: (percent: number) => void,
    signal?: AbortSignal,
  ): Promise<ApiResult<ConfirmUploadResponse>> {
    return this.uploadVideoDataSource.uploadVideo(uploadReq, onProgress,signal);
  }

  deleteVideo(videoId:number):Promise<ApiResult<string>>{
    return this.uploadVideoDataSource.deleteVideo(videoId)
  }
}
