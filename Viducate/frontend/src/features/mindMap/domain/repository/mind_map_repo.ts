import type { ApiResult } from "../../../../core/api/apiResult";
import type { MindMapEntity } from "../entity/maind_map_entity";
import type { MindMapReq } from "../entity/maind_map_req";

export interface MindMapRepo {
  getMindMapDetails(req: MindMapReq): Promise<ApiResult<MindMapEntity>>;
}
