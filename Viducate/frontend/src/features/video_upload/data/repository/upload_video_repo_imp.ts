import type { ApiResult } from "../../../../core/api/apiResult";
import type { ConfirmUploadResponse } from "../../domain/entity/confirm_upload_response";
import type { UploadVideoRequest } from "../../domain/entity/upload_video_request";
import type { UrlRequest } from "../../domain/entity/url_request";
import type { UrlResponse } from "../../domain/entity/url_response";
import type { UploadVideoRepo } from "../../domain/repository/upload_video_rep";
import type { UploadVideoDataSource } from "../dataSource/upload_video_dataSource";

export class uploadVideoRepoImp implements UploadVideoRepo {
  private uploadVideoDataSource: UploadVideoDataSource;

  constructor(uploadVideoDs: UploadVideoDataSource) {
    this.uploadVideoDataSource = uploadVideoDs;
  }
  uploadURL(uploadReq: UrlRequest): Promise<ApiResult<UrlResponse>> {
    return this.uploadVideoDataSource.uploadURL(uploadReq);
  }
  uploadVideo(
    uploadReq: UploadVideoRequest,
    onProgress?: (percent: number) => void,
    signal?: AbortSignal,
    onVideoIdReceived?: (id: number) => void,
  ): Promise<ApiResult<ConfirmUploadResponse>> {
    return this.uploadVideoDataSource.uploadVideo(
      uploadReq,
      onProgress,
      signal,
      onVideoIdReceived,
    );
  }

  deleteVideo(videoId: number): Promise<ApiResult<string>> {
    return this.uploadVideoDataSource.deleteVideo(videoId);
  }
}
