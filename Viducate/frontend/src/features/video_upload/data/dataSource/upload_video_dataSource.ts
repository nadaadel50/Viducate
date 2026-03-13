import type { ApiResult } from "../../../../core/api/apiResult";
import type { UploadVideoRequest } from "../../domain/entity/upload_video_request";
import type { UploadVideoResponse } from "../../domain/entity/upload_video_response";


export interface UploadVideoDataSource {
  uploadVideo(uploadReq: UploadVideoRequest): Promise<ApiResult<UploadVideoResponse>>;
}
