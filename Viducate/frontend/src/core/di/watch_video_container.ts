import { WatchVideoService } from "../../features/watch_video/api/client/watch_video_service";
import { WatchVideoDataSourceImp } from "../../features/watch_video/api/data_source/watch_video_data_source_imp";
import { WatchVideoRepoImp } from "../../features/watch_video/data/repository/watch_video_repo_imp";
import { GetSearchResultUseCase } from "../../features/watch_video/domin/usecase/get_search_results";
import { GetTopicsUseCase } from "../../features/watch_video/domin/usecase/get_topics";
import { SaveVideoProgressUseCase } from "../../features/watch_video/domin/usecase/save_video_progress";

const watchVideoService = new WatchVideoService();
const dataSource = new WatchVideoDataSourceImp(watchVideoService);
const repository = new WatchVideoRepoImp(dataSource);

export const getTopicsUseCase = new GetTopicsUseCase(repository);
export const getSearchResultsUseCase = new GetSearchResultUseCase(repository);
export const saveVideoProgressUseCase = new SaveVideoProgressUseCase(
  repository,
);
