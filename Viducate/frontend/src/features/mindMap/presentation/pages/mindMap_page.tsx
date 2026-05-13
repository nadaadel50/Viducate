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
import { useEffect } from "react";
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

    backgroundImage:
      COLORS.background.radialGradient,
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
