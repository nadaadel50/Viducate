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
import { useGetMindMap } from "../hooks/use_get_mind_map";





const nodeTypes = {
  custom: CustomNode,
};

// will convert the data came to this shape

const initialNodes = [
  {
    id: "1",
    type: "custom",

    position: {
      x: 100,
      y: 200,
    },

    data: {
      label: "Artificial Intelligence",
    },
  },

  {
    id: "2",
    type: "custom",

    position: {
      x: 450,
      y: 100,
    },

    data: {
      label: "Machine Learning",
    },
  },

  {
    id: "3",
    type: "custom",

    position: {
      x: 450,
      y: 300,
    },

    data: {
      label: "Computer Vision",
    },
  },

  {
    id: "4",
    type: "custom",

    position: {
      x: 800,
      y: 100,
    },

    data: {
      label: "Deep Learning",
    },
  },
];

const initialEdges = [
  {
    id: "e1-2",

    source: "1",
    target: "2",

    animated: true,
  },

  {
    id: "e1-3",

    source: "1",
    target: "3",
  },

  {
    id: "e2-4",

    source: "2",
    target: "4",
  },
];

export default function App() {
  const{data:mindMap}=useGetMindMap()
  console.log(mindMap?.title);
  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const onConnect = (
    connection: Connection
  ) => {
    console.log("NEW CONNECTION:");
    console.log(connection);

    setEdges((oldEdges) =>
      addEdge(connection, oldEdges)
    );
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
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