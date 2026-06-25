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
import { GenerationLoadingScreen } from "../../../../core/widgets/generation_loading_screen";
import { Brain } from "lucide-react";
import ErrorScreen from "../../../../core/widgets/error";
import { COLORS } from "../../../../core/constants";
import { useMindMapController } from "../hooks/use_mind_map_controler";
import { downloadMindMap } from "../utils/dowenload_mindMap";

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
      <GenerationLoadingScreen
        icon={<Brain />}
        titlePrefix="Building your"
        titleHighlight="Mind Map"
        subtitle="Analyzing the lecture structure and organizing key concepts..."
      />
    );
  }
  if (error) return <ErrorScreen errorMessage={error.message} />;



  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",

        backgroundColor: COLORS.background.light,

        backgroundImage: COLORS.background.radialGradient,
      }}
    >

        <div className="w-500">
       <button onClick={() => downloadMindMap()} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
  Download
</button>
      </div>
      <ReactFlow
      id="mindmap"
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
