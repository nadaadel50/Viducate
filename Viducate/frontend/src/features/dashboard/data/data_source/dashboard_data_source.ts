import type { ApiResult } from "../../../../core/api/apiResult";
import type { DashboardEntity } from "../../domain/entity/dashboard";

export interface DashboardDataSource {
  getDashboardData(): Promise<ApiResult<DashboardEntity>>;
}
