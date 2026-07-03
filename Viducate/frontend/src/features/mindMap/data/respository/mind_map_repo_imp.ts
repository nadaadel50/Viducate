import type { ApiResult } from "../../../../core/api/apiResult";
import type { MindMapEntity } from "../../domain/entity/maind_map_entity";
import type { MindMapReq } from "../../domain/entity/maind_map_req";
import type { MindMapRepo } from "../../domain/repository/mind_map_repo";
import type { MindMapDataSource } from "../data_source/mind_map_data_source";

export class MindMapRepoImp implements MindMapRepo {
  private dataSource: MindMapDataSource;
  constructor(dataSource: MindMapDataSource) {
    this.dataSource = dataSource;
  }
  getMindMapDetails(req: MindMapReq): Promise<ApiResult<MindMapEntity>> {
    return this.dataSource.getMindMapDetails(req);
  }
}
