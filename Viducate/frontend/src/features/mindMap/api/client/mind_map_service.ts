import { apiClient } from "../../../../core/api/apiClient";
import type { MindMapDto } from "../models/mind_map_dto";
import type { MindMapRequestDto } from "../models/mind_map_req_dto";

export class MindMapService {
  async getMindMapDetails(req: MindMapRequestDto): Promise<MindMapDto> {
    const response = await apiClient.get(`/mindmap/video/${req.video_id}`);

    return response.data;
  }
}
