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
import { useMindMapController } from "../hooks/use_mind_map_controler";

const nodeTypes = {
  custom: CustomNode,
};

export default function MindMapPage() {
  const {
    nodes: initialNodes,
    edges: initialEdges,
    isLoading,
    error,
  } = useMindMapFlow();


  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useMindMapController({
      initialNodes,
      initialEdges,
    });
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
        nodes={nodes}
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
