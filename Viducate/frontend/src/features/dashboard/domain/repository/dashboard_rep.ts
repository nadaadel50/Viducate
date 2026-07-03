import type { ApiResult } from "../../../../core/api/apiResult";
import type { DashboardEntity } from "../entity/dashboard";

export interface DashboardRepo {
  getDashboardData(): Promise<ApiResult<DashboardEntity>>;
}
