import type { ApiResult } from "../../../../core/api/apiResult";
import type { ConfirmUploadResponse } from "../entity/confirm_upload_response";
import type { UploadVideoRequest } from "../entity/upload_video_request";
import type { UrlRequest } from "../entity/url_request";
import type { UrlResponse } from "../entity/url_response";

export interface UploadVideoRepo {
  uploadVideo(
    uploadReq: UploadVideoRequest,
    onProgress?: (percent: number) => void,
    signal?: AbortSignal,
    onVideoIdReceived?: (id: number) => void,
  ): Promise<ApiResult<ConfirmUploadResponse>>;

  deleteVideo(videoId: number): Promise<ApiResult<string>>;

  uploadURL(uploadReq: UrlRequest): Promise<ApiResult<UrlResponse>>;
}
