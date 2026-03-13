import type { ApiResult } from "../../../../core/api/apiResult";
import type { UploadVideoRequest } from "../../domain/entity/upload_video_request";
import type { UploadVideoResponse } from "../../domain/entity/upload_video_response";
import type { UploadVideoRepo } from "../../domain/repository/upload_video_rep";
import type { UploadVideoDataSource } from "../dataSource/upload_video_dataSource";

export class uploadVideoRepoImp implements UploadVideoRepo{
    private uploadVideoDataSource:UploadVideoDataSource


    constructor(uploadVideoDs:UploadVideoDataSource){
        this.uploadVideoDataSource=uploadVideoDs
    }
    uploadVideo(uploadReq: UploadVideoRequest): Promise<ApiResult<UploadVideoResponse>> {
        return this.uploadVideoDataSource.uploadVideo(uploadReq)
    }
     
}