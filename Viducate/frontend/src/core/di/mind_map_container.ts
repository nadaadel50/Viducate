import { MindMapService } from "../../features/mindMap/api/client/mind_map_service";
import { MindMapDataSourceImp } from "../../features/mindMap/api/data_source/mind_map_data_source_imp";
import { MindMapRepoImp } from "../../features/mindMap/data/respository/mind_map_repo_imp";
import { GetMindMapDetails } from "../../features/mindMap/domain/usecase/get_mind_map_details";

const mindMapService = new MindMapService();
const dataSource = new MindMapDataSourceImp(mindMapService);
const repository = new MindMapRepoImp(dataSource);

export const getMindMapDetails = GetMindMapDetails(repository);
