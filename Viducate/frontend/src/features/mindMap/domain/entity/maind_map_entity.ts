import type { MindMapEdgeEntity } from "./edge_entity";
import type { MindMapNodeEntity } from "./node_entity";

export type MindMapEntity = {
  videoId: number;
  title: string;
  language: string;
  cached: boolean;
  nodes: MindMapNodeEntity[];
  edges: MindMapEdgeEntity[];
  createdAt: Date;
};
