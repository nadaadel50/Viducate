import dagre from "dagre";

import type {
  Edge,
  Node,
} from "reactflow";

const dagreGraph =
  new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(
  () => ({})
);

const nodeWidth = 220;
const nodeHeight = 80;

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[]
) {
 

  dagreGraph.setGraph({
    rankdir: "TB",
    ranksep: 300,
  nodesep: 200,

  });

 

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

 

  edges.forEach((edge) => {
    dagreGraph.setEdge(
      edge.source,
      edge.target
    );
  });



  dagre.layout(dagreGraph);

  

  nodes.forEach((node) => {
    const position =
      dagreGraph.node(node.id);

    node.position = {
      x: position.x,
      y: position.y,
    };
  });

  return {
    nodes,
    edges,
  };
}