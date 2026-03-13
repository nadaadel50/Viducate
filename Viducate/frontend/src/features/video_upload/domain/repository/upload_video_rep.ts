import type { ApiResult } from "../../../../core/api/apiResult";
import type { UploadVideoRequest } from "../entity/upload_video_request";
import type { UploadVideoResponse } from "../entity/upload_video_response";

export interface UploadVideoRepo {
  uploadVideo(uploadReq: UploadVideoRequest): Promise<ApiResult<UploadVideoResponse>>;
}
