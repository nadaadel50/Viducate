
import type { Stats } from "../../domain/entity/stats";


export type DashboardStatsDto = {
  total_videos_saved: number;
  total_watch_time_seconds: number;
  total_storage: number;
  used_storage: number;
};

export function mapDashboardStatsDtoToEntity(
  dto: DashboardStatsDto
): Stats {
  return {
    total_videos_saved: dto.total_videos_saved,
    total_watch_time_seconds: dto.total_watch_time_seconds,
    total_storage: dto.total_storage,
    used_storage: dto.used_storage,
  };
}