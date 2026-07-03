import type { ApiResult } from "../../../../core/api/apiResult";
import type { MindMapEntity } from "../../domain/entity/maind_map_entity";
import type { MindMapReq } from "../../domain/entity/maind_map_req";

export interface MindMapDataSource {
  getMindMapDetails(req: MindMapReq): Promise<ApiResult<MindMapEntity>>;
}
