import type { MindMapEntity } from "../../domain/entity/maind_map_entity";
import { toMindMapEdgeEntity, type MindMapEdgeDto } from "./edge_dto";
import { toMindMapNodeEntity, type MindMapNodeDto } from "./node_dto";

export type MindMapDto = {
  video_id: number;
  title: string;
  language: string;
  cached: boolean;
  nodes: MindMapNodeDto[];
  edges: MindMapEdgeDto[];
  created_at: string;
};

export function toMindMapEntity(dto: MindMapDto): MindMapEntity {
  return {
    videoId: dto.video_id,
    title: dto.title,
    language: dto.language,
    cached: dto.cached,

    nodes: dto.nodes.map(toMindMapNodeEntity),

    edges: dto.edges.map(toMindMapEdgeEntity),

    createdAt: new Date(dto.created_at),
  };
}
