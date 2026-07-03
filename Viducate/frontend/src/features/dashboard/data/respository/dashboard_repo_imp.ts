import type { ApiResult } from "../../../../core/api/apiResult";
import type { DashboardDataSource } from "../data_source/dashboard_data_source";
import type { DashboardEntity } from "../../domain/entity/dashboard";
import type { DashboardRepo } from "../../domain/repository/dashboard_rep";

export class DashboardRepoImp implements DashboardRepo {
  private dataSource: DashboardDataSource;
  constructor(dataSource: DashboardDataSource) {
    this.dataSource = dataSource;
  }
  getDashboardData(): Promise<ApiResult<DashboardEntity>> {
    return this.dataSource.getDashboardData();
  }
}
