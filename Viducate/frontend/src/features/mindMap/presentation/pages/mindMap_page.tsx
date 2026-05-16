import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type NodeProps,
} from "reactflow";

import "reactflow/dist/style.css";
import { CustomNode } from "../widgets/custom_node";
import { useMindMapFlow } from "../hooks/use_mind_map";
import { useCallback, useEffect } from "react";
import { LoadingScreen } from "../../../../core/widgets/advanced_loading";
import { Brain } from "lucide-react";
import ErrorMessage from "../../../../core/widgets/error";
import { COLORS } from "../../../../core/constants";

const nodeTypes = {
  custom: CustomNode,
};

export default function MindMapPage() {
  const {
    nodes: initialNodes,
    edges: intailEdges,
    isLoading,
    error,
  } = useMindMapFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] = useEdgesState(intailEdges);
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(intailEdges);
  }, [intailEdges, setEdges]);

 const toggleNode = useCallback((nodeId: string) => {
  setNodes((prev) => {
    const clickedNode = prev.find((n) => n.id === nodeId);
    if (!clickedNode) return prev;
    const nowExpanded = !clickedNode.data.expanded;

    const directChildIds = new Set(
      edges
        .filter((e) => e.source === nodeId)
        .map((e) => e.target)
    );

    return prev.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: { ...node.data, expanded: nowExpanded },
        };
      }

      if (directChildIds.has(node.id)) {
        return {
          ...node,
          hidden: !nowExpanded,
         
          data: {
            ...node.data,
            expanded: nowExpanded ? node.data.expanded : false,
          },
        };
      }

      return node;
    });
  });

  setEdges((prev) => {
    const directChildEdges = new Set(
      prev
        .filter((e) => e.source === nodeId)
        .map((e) => e.id)
    );

    const clickedNode = nodes.find((n) => n.id === nodeId);
    const nowExpanded = !clickedNode?.data.expanded;

    return prev.map((edge) => {
      if (directChildEdges.has(edge.id)) {
        return { ...edge, hidden: !nowExpanded };
      }
      return edge;
    });
  });
}, [edges, nodes]);

  const nodesWithToggle = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onToggle: toggleNode,
    },
  }));

  if (isLoading) {
    return (
      <LoadingScreen
        icon={<Brain />}
        titlePrefix="Building your"
        titleHighlight="Mind Map"
        subtitle="Analyzing the lecture structure and organizing key concepts..."
      />
    );
  }
  if (error) return <ErrorMessage errorMessage={error.message} />;

  const onConnect = (connection: Connection) => {
    setEdges((oldEdges) => addEdge(connection, oldEdges));
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",

        backgroundColor: COLORS.background.light,

        backgroundImage: COLORS.background.radialGradient,
      }}
    >
      <ReactFlow
        nodes={nodesWithToggle}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
