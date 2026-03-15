import type { ApiResult } from "../../../../core/api/apiResult";
import type { ConfirmUploadResponse } from "../../domain/entity/confirm_upload_response";
import type { UploadVideoRequest } from "../../domain/entity/upload_video_request";


export interface UploadVideoDataSource {
 uploadVideo(
   uploadReq: UploadVideoRequest,
   onProgress?: (percent: number) => void,
   signal?: AbortSignal
 ):Promise<ApiResult<ConfirmUploadResponse>>


 deleteVideo(videoId:number):Promise<ApiResult<string>>
}
