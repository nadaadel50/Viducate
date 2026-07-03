import { apiClient } from "../../../../core/api/apiClient";
import type { VideoStatusResponseDto } from "../model/video_status_response_dto";

export class VideoStatusService {
  async getVideoStatus(videoId: number): Promise<VideoStatusResponseDto> {
    const response = await apiClient.get<VideoStatusResponseDto>(
      `/videos/${videoId}/status`,
    );
    return response.data;
  }
  cancelAnalysis(videoId: number) {
    return apiClient.post<string>(`/videos/${videoId}/cancel`);
  }
}
