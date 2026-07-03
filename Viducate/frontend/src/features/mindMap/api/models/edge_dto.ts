import type { MindMapEdgeEntity } from "../../domain/entity/edge_entity";

export type MindMapEdgeDto = {
  id: string;
  source: string;
  target: string;
};

export function toMindMapEdgeEntity(dto: MindMapEdgeDto): MindMapEdgeEntity {
  return {
    id: dto.id,
    source: dto.source,
    target: dto.target,
  };
}
