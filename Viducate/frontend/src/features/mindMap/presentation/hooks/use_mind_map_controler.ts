import { use, useCallback, useEffect } from "react";

import {
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
} from "reactflow";
import { STORAGE_KEYS } from "../../../../core/constants";

type Params = {
  initialNodes: any[];
  initialEdges: any[];
};

export function useMindMapController({ initialNodes, initialEdges }: Params) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    restoreNodesState(initialNodes),
  );

  function restoreNodesState(nodes: any[]) {
    const saved = sessionStorage.getItem(STORAGE_KEYS.mind_map_state);

    if (!saved) return nodes;

    const parsed = JSON.parse(saved);

    return nodes.map((node) => {
      const savedNode = parsed.nodes?.[node.id];

      if (!savedNode) return node;

      return {
        ...node,

        hidden: savedNode.hidden,

        data: {
          ...node.data,

          expanded: savedNode.expanded,
        },
      };
    });
  }
  function restoreEdgesState(edges: any[]) {
    const saved = sessionStorage.getItem(STORAGE_KEYS.mind_map_state);

    if (!saved) return edges;

    const parsed = JSON.parse(saved);

    return edges.map((edge) => {
      const savedEdge = parsed.edges?.[edge.id];

      if (!savedEdge) return edge;

      return {
        ...edge,

        hidden: savedEdge.hidden,
      };
    });
  }

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    restoreEdgesState(initialEdges),
  );


  useEffect(() => {
    setNodes(restoreNodesState(initialNodes));
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(restoreEdgesState(initialEdges));
  }, [initialEdges, setEdges]);

  useEffect(() => {
    if (nodes.length === 0) return;

    const nodesState = nodes.reduce(
      (acc, node) => {
        acc[node.id] = {
          hidden: node.hidden,
          expanded: node.data.expanded,
        };
        return acc;
      },
      {} as Record<string, any>,
    );

    const edgesState = edges.reduce(
      (acc, edge) => {
        acc[edge.id] = {
          hidden: edge.hidden,
        };
        return acc;
      },
      {} as Record<string, any>,
    );

    sessionStorage.setItem(
      STORAGE_KEYS.mind_map_state,
      JSON.stringify({ nodes: nodesState, edges: edgesState }),
    );
  }, [nodes, edges]);


  const toggleNode = useCallback(
    (nodeId: string) => {
      const clickedNode = nodes.find((n) => n.id === nodeId);
      if (!clickedNode) return;

      const nowExpanded = !clickedNode.data.expanded;

      if (nowExpanded) {
        const directChildIds = new Set(
          edges.filter((e) => e.source === nodeId).map((e) => e.target),
        );

        setNodes((prev) =>
          prev.map((node) => {
            if (node.id === nodeId) {
              return { ...node, data: { ...node.data, expanded: true } };
            }
            if (directChildIds.has(node.id)) {
              return { ...node, hidden: false };
            }
            return node;
          }),
        );

        setEdges((prev) =>
          prev.map((edge) =>
            edge.source === nodeId ? { ...edge, hidden: false } : edge,
          ),
        );
      } else {
        function getAllDescendants(parentId: string): Set<string> {
          const result = new Set<string>();
          const queue = [parentId];
          while (queue.length > 0) {
            const current = queue.shift()!;
            edges
              .filter((e) => e.source === current)
              .forEach((e) => {
                result.add(e.target);
                queue.push(e.target);
              });
          }
          return result;
        }

        const allDescendants = getAllDescendants(nodeId);

        setNodes((prev) =>
          prev.map((node) => {
            if (node.id === nodeId) {
              return { ...node, data: { ...node.data, expanded: false } };
            }
            if (allDescendants.has(node.id)) {
              return {
                ...node,
                hidden: true,
                data: { ...node.data, expanded: false },
              };
            }
            return node;
          }),
        );

        setEdges((prev) =>
          prev.map((edge) => {
            const isDescendantEdge =
              allDescendants.has(edge.target) || edge.source === nodeId;
            return isDescendantEdge ? { ...edge, hidden: true } : edge;
          }),
        );
      }
    },
    [edges, nodes, setNodes, setEdges],
  );

  const nodesWithToggle = nodes.map((node) => ({
    ...node,

    data: {
      ...node.data,

      onToggle: toggleNode,
    },
  }));

  const onConnect = (connection: Connection) => {
    setEdges((oldEdges) => addEdge(connection, oldEdges));
  };

  return {
    nodes: nodesWithToggle,
    edges,

    onNodesChange,
    onEdgesChange,

    onConnect,
  };
}
