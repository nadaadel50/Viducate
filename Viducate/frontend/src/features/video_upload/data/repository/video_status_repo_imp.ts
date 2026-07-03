import type { ApiResult } from "../../../../core/api/apiResult";
import type { VideoStatusEntity } from "../../domain/entity/video_status_entity";
import type { VideoStatusRepository } from "../../domain/repository/video_status_repository";
import type { VideoStatusDataSource } from "../dataSource/video_status_dataSource";

export class VideoStatusRepoImp implements VideoStatusRepository {
  private dataSource: VideoStatusDataSource;
  constructor(dataSource: VideoStatusDataSource) {
    this.dataSource = dataSource;
  }

  async getVideoStatus(videoId: number): Promise<VideoStatusEntity> {
    const dto = await this.dataSource.getVideoStatus(videoId);
    return {
      id: dto.video_id,
      status: dto.processing_status,
      title: dto.title,
    };
  }
  cancelAnalysis(videoId: number): Promise<ApiResult<void>> {
    return this.dataSource.cancelAnalysis(videoId);
  }
}
