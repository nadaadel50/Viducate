import axios from "axios";
import { apiClient } from "../../../../core/api/apiClient";
import type { UploadVideoResponseDTO } from "../model/upload_video_response_dto";
import type { ConfirmUploadResponseDto } from "../model/confirm_upload_video_response_dto";
import type { UrlRequestDto } from "../model/url_request_dto";
import type { UrlResponseDto } from "../model/url_response_dto";

export class UploadVideoService {
  async requestUploadLink(formData: FormData): Promise<UploadVideoResponseDTO> {
    const response = await apiClient.post(`/videos/upload`, formData);
    return response.data;
  }

  async uploadVideo(
    upload_url: string,
    file: File,
    onProgress?: (percent: number) => void,
    signal?: AbortSignal,
  ) {
    const response = await axios.put(upload_url, file, {
      headers: {
        "Content-Type": file.type,
      },

      signal: signal,

      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;

        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );

        onProgress?.(percent);
      },
    });

    return response;
  }

  async confirmUpload(video_id: number): Promise<ConfirmUploadResponseDto> {
    const response = await apiClient.post(`/videos/${video_id}/confirm`);

    return response.data;
  }

  async deleteVideo(video_id:number):Promise<string>{
  
     const response = await apiClient.delete(`/videos/${video_id}`);
     return response.data

  }
  async uploadURl(uploadReqDto:UrlRequestDto):Promise<UrlResponseDto>{
     const response = await apiClient.post(`/videos/url`,uploadReqDto);
   
     return response.data

  }
}
