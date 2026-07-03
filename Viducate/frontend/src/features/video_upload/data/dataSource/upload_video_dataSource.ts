import type { ApiResult } from "../../../../core/api/apiResult";
import type { ConfirmUploadResponse } from "../../domain/entity/confirm_upload_response";
import type { UploadVideoRequest } from "../../domain/entity/upload_video_request";
import type { UrlRequest } from "../../domain/entity/url_request";
import type { UrlResponse } from "../../domain/entity/url_response";

export interface UploadVideoDataSource {
  uploadVideo(
    uploadReq: UploadVideoRequest,
    onProgress?: (percent: number) => void,
    signal?: AbortSignal,
    onVideoIdReceived?: (id: number) => void,
  ): Promise<ApiResult<ConfirmUploadResponse>>;

  deleteVideo(videoId: number): Promise<ApiResult<string>>;

  uploadURL(uploadReq: UrlRequest): Promise<ApiResult<UrlResponse>>;
}
