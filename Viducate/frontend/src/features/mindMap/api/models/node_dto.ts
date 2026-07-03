import type { MindMapNodeEntity } from "../../domain/entity/node_entity";
import type { MindMapNodeType } from "../../domain/entity/node_type";

export type MindMapNodeDto = {
  id: string;
  label: string;
  type: string;
};

function mapNodeType(type: string): MindMapNodeType {
  return type as MindMapNodeType;
}

export function toMindMapNodeEntity(dto: MindMapNodeDto): MindMapNodeEntity {
  return {
    id: dto.id,
    label: dto.label,
    type: mapNodeType(dto.type),
  };
}
