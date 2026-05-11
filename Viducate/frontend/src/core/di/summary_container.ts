import { SummaryDataSourceImp } from "../../features/summarization/api/data_source/summary_data_source_imp";
import { SummaryRepoImp } from "../../features/summarization/data/repository/summary_repo_imp";
import { GetVideoSummaryUsecase } from "../../features/summarization/domain/usecase/get_video_summary_usecase";
import { GetSegmentSummaryUsecase } from "../../features/summarization/domain/usecase/get_segment_summary_usecase";

const dataSource = new SummaryDataSourceImp();
const repo = new SummaryRepoImp(dataSource);

export const getVideoSummaryUsecase = new GetVideoSummaryUsecase(repo);
export const getSegmentSummaryUsecase = new GetSegmentSummaryUsecase(repo);