import axios, { toFormData } from "axios";
import handleApiError from "../../../../core/api/apiError";
import type { ApiResult } from "../../../../core/api/apiResult";
import type { UploadVideoDataSource } from "../../data/dataSource/upload_video_dataSource";
import type { UploadVideoRequest } from "../../domain/entity/upload_video_request";
import type { UploadVideoResponse } from "../../domain/entity/upload_video_response";
import type { UploadVideoService } from "../client/upload_video_service";
import { uploadFilestoFormData } from "../model/upload_video_req_dto";


export class UploadVideoDataSourceImp implements UploadVideoDataSource {
  private uploadVideoService: UploadVideoService;
  constructor(uploadVideoService: UploadVideoService) {
    this.uploadVideoService = uploadVideoService;
  }
  async uploadVideo(
    uploadReq: UploadVideoRequest,
  ): Promise<ApiResult<UploadVideoResponse>> {
    try {
      const response = await this.uploadVideoService.requestUploadLink(
       uploadFilestoFormData(uploadReq)
      );
      await this.uploadVideoService.uploadVideo(response.upload_url, uploadReq.file);

      await this.uploadVideoService.confirmUpload(response.video_id);
  
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }
}
