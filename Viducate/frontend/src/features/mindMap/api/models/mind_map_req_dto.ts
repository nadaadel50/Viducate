import type { MindMapReq } from "../../domain/entity/maind_map_req";

export interface MindMapRequestDto {
  video_id: number;
}

export function toMindMapRequestDto(entity: MindMapReq): MindMapRequestDto {
  return {
    video_id: entity.videoid,
  };
}
