import type { Edge, Node } from "reactflow";
import type { MindMapEntity } from "../../domain/entity/maind_map_entity";

export function transformMindMap(data: MindMapEntity) {
  const childToParent: Record<string, string> = {};
  const parentToChildren: Record<string, string[]> = {};

  data.edges.forEach((edge) => {
    childToParent[edge.target] = edge.source;
    if (!parentToChildren[edge.source]) parentToChildren[edge.source] = [];
    parentToChildren[edge.source].push(edge.target);
  });

  const rootId = data.nodes.find((n) => !childToParent[n.id])?.id;

  const level1Ids = new Set(rootId ? (parentToChildren[rootId] ?? []) : []);

  const nodes: Node[] = data.nodes.map((node) => {
    const isRoot = node.id === rootId;
    const isLevel1 = level1Ids.has(node.id);

    return {
      id: node.id,
      type: "custom",
      position: { x: 0, y: 0 },
      hidden: !isRoot && !isLevel1,
      data: {
        label: node.label,
        type: node.type,
        isRoot,
        expanded: false,
        parentId: childToParent[node.id] ?? null,
        hasChildren: (parentToChildren[node.id]?.length ?? 0) > 0,
      },
    };
  });

  const edges: Edge[] = data.edges.map((edge) => {
    const isLevel1Edge = rootId === edge.source;

    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: false,

      hidden: !isLevel1Edge,
    };
  });

  return { nodes, edges };
}
