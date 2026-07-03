import { ReportDataSourceImp } from "../../features/report/api/data_source/report_data_source_imp";
import { ReportRepoImp } from "../../features/report/data/repository/report_repo_imp";
import { GetVideoReportUsecase } from "../../features/report/domain/usecase/get_video_report_usecase";

const reportDataSource = new ReportDataSourceImp();
const reportRepo = new ReportRepoImp(reportDataSource);

export const getVideoReportUsecase = new GetVideoReportUsecase(reportRepo);
