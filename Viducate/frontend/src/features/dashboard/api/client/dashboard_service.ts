import { apiClient } from "../../../../core/api/apiClient";
import type { DashboardDto } from "../models/dashboard_dto";

export class DashboardService {
  async getDashboard(): Promise<DashboardDto> {
    const response = await apiClient.get(`/dashboard`);

    return response.data;
  }
}
