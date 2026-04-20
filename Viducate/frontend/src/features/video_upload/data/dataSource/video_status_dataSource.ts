import type { VideoStatusResponseDto } from '../../api/model/video_status_response_dto';
export interface VideoStatusDataSource {
  getVideoStatus(videoId: number): Promise<VideoStatusResponseDto>;
}