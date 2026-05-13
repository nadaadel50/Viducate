import type {
  Edge,
  Node,
} from "reactflow";
import type { MindMapEntity } from "../../domain/entity/maind_map_entity";

export function transformMindMap(data:MindMapEntity) {


  const nodes: Node[] = data.nodes.map(
    (node) => ({
      id: node.id,

      type: "custom",

      position: {
        x: 0,
        y: 0,
      },

      data: {
        label: node.label,
        type: node.type,
      },
    })
  );


  const edges: Edge[] = data.edges.map(
    (edge) => ({
      id: edge.id,

      source: edge.source,

      target: edge.target,

      animated: false,
    })
  );

  return {
    nodes,
    edges,
  };
}