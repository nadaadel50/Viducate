import type { VideoStatusRepository } from "../repository/video_status_repository";

export class GetVideoStatusUseCase {
  private repository: VideoStatusRepository;
  constructor(repository: VideoStatusRepository) {
    this.repository = repository;
  }

  async execute(videoId: number) {
    return await this.repository.getVideoStatus(videoId);
  }
}
