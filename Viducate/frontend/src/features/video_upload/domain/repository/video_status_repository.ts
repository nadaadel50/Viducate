import type { VideoStatusEntity } from '../entity/video_status_entity';
export interface VideoStatusRepository {
  getVideoStatus(videoId: number): Promise<VideoStatusEntity>;
}