import type { ContinueLearningEntity } from "../../domain/entity/continue_learning";

export type ContinueLearningDto = {
  videoId: number;
  title: string;
  thumbnail_url: string;
  duration: number;
  currentTime: number;
  remainingTime: number;
  progress: number;
  is_completed: boolean;
  last_watched_at: string;
  created_at: string;
  video_type: string;
};

export function mapContinueLearningDtoToEntity(
  dto: ContinueLearningDto,
): ContinueLearningEntity {
  return {
    videoId: dto.videoId,
    title: dto.title,
    thumbnail_url: dto.thumbnail_url,
    duration: dto.duration,
    currentTime: dto.currentTime,
    remainingTime: dto.remainingTime,
    progress: dto.progress,
    is_completed: dto.is_completed,
    last_watched_at: dto.last_watched_at,
    created_at: dto.created_at,
    video_type: dto.video_type,
  };
}
