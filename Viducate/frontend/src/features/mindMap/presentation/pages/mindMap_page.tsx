import { Background, Controls, ReactFlow } from "reactflow";

import "reactflow/dist/style.css";
import { CustomNode } from "../widgets/custom_node";
import { useMindMapFlow } from "../hooks/use_mind_map";
import { GenerationLoadingScreen } from "../../../../core/componants/generation_loading_screen";
import { Brain } from "lucide-react";
import { COLORS } from "../../../../core/constants";
import { useMindMapController } from "../hooks/use_mind_map_controler";
import ErrorScreen from "../../../../core/componants/error_screen";
import { useIntl } from "react-intl";
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
  const intl = useIntl();

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useMindMapController({
      initialNodes,
      initialEdges,
    });
  if (isLoading) {
    return (
      <GenerationLoadingScreen
        icon={<Brain />}
        titlePrefix={intl.formatMessage({
          id: "mindmap.loading.titlePrefix",
        })}
        titleHighlight={intl.formatMessage({
          id: "mindmap.loading.titleHighlight",
        })}
        subtitle={intl.formatMessage({
          id: "mindmap.loading.subtitle",
        })}
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
      <div className="w-full ">
        {/* <button
          onClick={() => downloadMindMap()}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <FormattedMessage id="mindmap.download" />
        </button> */}
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
