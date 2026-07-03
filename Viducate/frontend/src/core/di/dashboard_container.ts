import { DashboardService } from "../../features/dashboard/api/client/dashboard_service";
import { DashboardDataSourceImp } from "../../features/dashboard/api/data_source/dashboard_data_source_imp";
import { DashboardRepoImp } from "../../features/dashboard/data/respository/dashboard_repo_imp";
import { GetDashboardData } from "../../features/dashboard/domain/usecase/get_sessions";

const dashboardService = new DashboardService();
const dataSource = new DashboardDataSourceImp(dashboardService);
const repository = new DashboardRepoImp(dataSource);

export const getDashboardData = GetDashboardData(repository);
