import axios from "axios";
import { apiClient } from "../../../../core/api/apiClient";
import type { UploadVideoResponseDTO } from "../model/upload_video_response_dto";

export class UploadVideoService {
  async requestUploadLink(formData: FormData): Promise<UploadVideoResponseDTO> {
    const response = await apiClient.post(`/videos/upload`, formData);
    return response.data;
  }

  async uploadVideo(upload_url: string, file: File) {
    const response = await axios.put(upload_url, file, {
      headers: {
        "Content-Type": file.type,
      },
      timeout: 0,
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;

        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        console.log(percent);
      },
    });

    return response;
  }

  async confirmUpload(video_id: number) {
    const response = await apiClient.post(`/api/v1/videos/${video_id}/confirm`);

    return response;
  }
}
