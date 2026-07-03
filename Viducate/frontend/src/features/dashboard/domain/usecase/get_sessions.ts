import type { ApiResult } from "../../../../core/api/apiResult";

import type { DashboardEntity } from "../entity/dashboard";
import type { DashboardRepo } from "../repository/dashboard_rep";

export const GetDashboardData = (repo: DashboardRepo) => {
  return async (): Promise<ApiResult<DashboardEntity>> => {
    return repo.getDashboardData();
  };
};
