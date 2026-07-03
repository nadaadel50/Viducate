import handleApiError from "../../../../core/api/apiError";
import type { ApiResult } from "../../../../core/api/apiResult";
import type { UploadVideoDataSource } from "../../data/dataSource/upload_video_dataSource";
import type { UploadVideoRequest } from "../../domain/entity/upload_video_request";
import type { UploadVideoService } from "../client/upload_video_service";
import { uploadFilestoFormData } from "../model/upload_video_req_dto";
import type { ConfirmUploadResponse } from "../../domain/entity/confirm_upload_response";
import { toConfirmEntity } from "../model/confirm_upload_video_response_dto";
import axios from "axios";
import type { UrlRequest } from "../../domain/entity/url_request";
import type { UrlResponse } from "../../domain/entity/url_response";
import { toUrlResponse } from "../model/url_response_dto";
import { toUrlRequestDto } from "../model/url_request_dto";



export class UploadVideoDataSourceImp implements UploadVideoDataSource {
  private uploadVideoService: UploadVideoService;
  constructor(uploadVideoService: UploadVideoService) {
    this.uploadVideoService = uploadVideoService;
  }
 
 async uploadVideo(
  uploadReq: UploadVideoRequest,
  onProgress?: (percent: number) => void,
  signal?: AbortSignal,
  onVideoIdReceived?: (id: number) => void
): Promise<ApiResult<ConfirmUploadResponse>> {

  let videoId: number | undefined;


  try {
   

    const linkRes = await this.uploadVideoService.requestUploadLink(
      uploadFilestoFormData(uploadReq)
    );
  
    
 onVideoIdReceived?.(linkRes.video_id);
    videoId = linkRes.video_id;

    await this.uploadVideoService.uploadVideo(
      linkRes.upload_url,
      uploadReq.file,
      onProgress,
      signal
    );

    const confirmRes = await this.uploadVideoService.confirmUpload(videoId);

    

    return {
      success: true,
      data: toConfirmEntity(confirmRes),
    };

  } catch (error) {

    

    if (axios.isCancel(error) && videoId) {
    
      return {
        success: true,
        data: {
          videoId: videoId,
          title: uploadReq.title,
          message: "Upload cancelled",
          processing_status: "cancelled",
        },
      };
    }

    const message = handleApiError(error);
    return { success: false, error: message };
  }
}


async deleteVideo(videoId:number):Promise<ApiResult<string>>{
  try{
    const response=await this.uploadVideoService.deleteVideo(videoId)
    return {success:true,data:response}
  }
  catch(error){
     const message = handleApiError(error);
    return { success: false, error: message };

  }

}


 async uploadURL(uploadReq: UrlRequest): Promise<ApiResult<UrlResponse>> {
   try{
    const response=await this.uploadVideoService.uploadURl(toUrlRequestDto(uploadReq))
    return {success:true,data:toUrlResponse(response)}
  }
  catch(error){
     const message = handleApiError(error);
    return { success: false, error: message };

  }

  }



}