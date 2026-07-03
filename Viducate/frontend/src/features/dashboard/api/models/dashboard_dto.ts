import type { DashboardEntity } from "../../domain/entity/dashboard";
import {
  type ContinueLearningDto,
  mapContinueLearningDtoToEntity,
} from "./continue_learning_dto";
import {
  type DashboardStatsDto,
  mapDashboardStatsDtoToEntity,
} from "./dashboard_stats_dto";
import { type UserDto, mapUserDtoToEntity } from "./user_dashboard_dto";

export type DashboardDto = {
  user: UserDto;
  stats: DashboardStatsDto;
  continue_learning: ContinueLearningDto[];
};

export function mapDashboardDtoToEntity(dto: DashboardDto): DashboardEntity {
  return {
    user: mapUserDtoToEntity(dto.user),

    stats: mapDashboardStatsDtoToEntity(dto.stats),

    continue_learning: dto.continue_learning.map(
      mapContinueLearningDtoToEntity,
    ),
  };
}
