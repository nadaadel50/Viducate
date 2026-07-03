import type { MindMapNodeType } from "./node_type";

export type MindMapNodeEntity = {
  id: string;
  label: string;
  type: MindMapNodeType;
};
