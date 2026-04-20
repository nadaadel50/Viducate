import { VideoStatusService } from '../client/video_status_service';
import type { VideoStatusDataSource } from '../../data/dataSource/video_status_dataSource';

export class VideoStatusDataSourceImp implements VideoStatusDataSource {
  private service: VideoStatusService;
  constructor( service: VideoStatusService) {
    this.service = service;
  }

  async getVideoStatus(videoId: number) {
    return await this.service.getVideoStatus(videoId);
  }
}