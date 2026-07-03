import type { ApiResult } from "../../../../core/api/apiResult";

import handleApiError from "../../../../core/api/apiError";
import type { MindMapDataSource } from "../../data/data_source/mind_map_data_source";
import type { MindMapService } from "../client/mind_map_service";
import type { MindMapEntity } from "../../domain/entity/maind_map_entity";
import type { MindMapReq } from "../../domain/entity/maind_map_req";
import { toMindMapRequestDto } from "../models/mind_map_req_dto";
import { toMindMapEntity } from "../models/mind_map_dto";

export class MindMapDataSourceImp implements MindMapDataSource {
  private service: MindMapService;
  constructor(service: MindMapService) {
    this.service = service;
  }
  async getMindMapDetails(req: MindMapReq): Promise<ApiResult<MindMapEntity>> {
    try {
      const response = await this.service.getMindMapDetails(
        toMindMapRequestDto(req),
      );

      const resonseEntity: MindMapEntity = toMindMapEntity(response);

      return {
        success: true,
        data: resonseEntity,
      };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }
}
