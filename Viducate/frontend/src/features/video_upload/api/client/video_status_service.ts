import { apiClient } from '../../../../core/api/apiClient';
import type { VideoStatusResponseDto } from '../model/video_status_response_dto';

export class VideoStatusService {
  async getVideoStatus(videoId: number): Promise<VideoStatusResponseDto> {
    const response = await apiClient.get<VideoStatusResponseDto>(`/api/v1/videos/${videoId}/status`);
    return response.data;
  }
}