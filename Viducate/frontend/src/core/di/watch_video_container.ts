import { WatchVideoService } from "../../features/watch_video/api/client/watch_video_service";
import { WatchVideoDataSourceImp } from "../../features/watch_video/api/data_source/watch_video_data_source_imp";
import { WatchVideoRepoImp } from "../../features/watch_video/data/repository/watch_video_repo_imp";
import { GetTopicsUseCase } from "../../features/watch_video/domin/usecase/get_topics";


const watchVideoService = new WatchVideoService();
const dataSource = new WatchVideoDataSourceImp(watchVideoService);
const repository = new WatchVideoRepoImp(dataSource);

export const getTopicsUseCase = new GetTopicsUseCase(repository);

