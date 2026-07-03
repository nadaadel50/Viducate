import type { ApiResult } from "../../../../core/api/apiResult";

import handleApiError from "../../../../core/api/apiError";
import type { DashboardDataSource } from "../../data/data_source/dashboard_data_source";
import type { DashboardService } from "../client/dashboard_service";
import type { DashboardEntity } from "../../domain/entity/dashboard";
import { mapDashboardDtoToEntity } from "../models/dashboard_dto";

export class DashboardDataSourceImp implements DashboardDataSource {
  private service: DashboardService;
  constructor(service: DashboardService) {
    this.service = service;
  }
  async getDashboardData(): Promise<ApiResult<DashboardEntity>> {
    try {
      const response = await this.service.getDashboard();

      const resonseEntity: DashboardEntity = mapDashboardDtoToEntity(response);

      return {
        success: true,
        data: resonseEntity,
      };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }
}
