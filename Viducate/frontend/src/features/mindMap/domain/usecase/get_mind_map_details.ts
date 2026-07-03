import type { ApiResult } from "../../../../core/api/apiResult";
import type { MindMapReq } from "../entity/maind_map_req";
import type { MindMapEntity } from "../entity/maind_map_entity";
import type { MindMapRepo } from "../repository/mind_map_repo";

export const GetMindMapDetails = (repo: MindMapRepo) => {
  return async (req: MindMapReq): Promise<ApiResult<MindMapEntity>> => {
    return repo.getMindMapDetails(req);
  };
};
