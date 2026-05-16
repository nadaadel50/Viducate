import { Handle, Position, type NodeProps } from "reactflow";
import { getNodeStyle } from "../utils/get_node_color";
import type { MindMapNodeType } from "../../domain/entity/node_type";

type CustomNodeData = {
  label: string;
  type: MindMapNodeType;
  isRoot: boolean;
  expanded: boolean;
  parentId: string | null;
  hasChildren: boolean;
  onToggle?: (nodeId: string) => void;
};

const handleStyle = {  // for edge
  width: 10,
  height: 10,
  background: "rgba(255,255,255,0.6)",
  border: "2px solid rgba(255,255,255,0.9)",
};

export function CustomNode({ id, data }: NodeProps<CustomNodeData>) {
  const hasToggle = !data.isRoot && data.hasChildren;
  const nodeStyle = getNodeStyle(data.type);

  return (
    <div
      className="font-display"
      style={{
        padding: "14px 20px",
        borderRadius: "20px",
        minWidth: "180px",
        maxWidth: "240px",
        textAlign: "center",
        whiteSpace: "normal",
        position: "relative",
        cursor: "default",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        ...nodeStyle,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px) scale(1.02)";
        (e.currentTarget as HTMLDivElement).style.filter = "brightness(1.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0) scale(1)";
        (e.currentTarget as HTMLDivElement).style.filter = "brightness(1)";
      }}
    >
     
      <Handle type="source" position={Position.Top}    id="top"    style={{ ...handleStyle, top: -5 }} />
      <Handle type="target" position={Position.Top}    id="top"    style={{ ...handleStyle, top: -5 }} />

      <Handle type="source" position={Position.Bottom} id="bottom" style={{ ...handleStyle, bottom: -5 }} />
      <Handle type="target" position={Position.Bottom} id="bottom" style={{ ...handleStyle, bottom: -5 }} />

      <Handle type="source" position={Position.Left}   id="left"   style={{ ...handleStyle, left: -5 }} />
      <Handle type="target" position={Position.Left}   id="left"   style={{ ...handleStyle, left: -5 }} />

      <Handle type="source" position={Position.Right}  id="right"  style={{ ...handleStyle, right: -5 }} />
      <Handle type="target" position={Position.Right}  id="right"  style={{ ...handleStyle, right: -5 }} />

      {/* Type badge */}
     
        <div
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: 0.75,
            marginBottom: "6px",
          }}
        >
          {data.type}
        </div>
      

      {/* Label */} 
      <div
        style={{
          fontWeight: 700,
          fontSize: data.type === "root" ? "25px" : "20px",
          lineHeight: 1.4,
          letterSpacing: "0.01em",
        }}
      >
        {data.label}
      </div>

      {/* Subtle inner highlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "20px",
          background: "linear-gradient(160deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

    
      {hasToggle && data.onToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onToggle!(id);
          }}
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            width: 30,
            height: 30,
            borderRadius: "50%",
             

            border: "2px solid rgba(255,255,255,0.9)",
            background: data.expanded ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
            color: data.expanded ? "#085041" : "#fff",
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            zIndex: 10,
          }}
        >
          {data.expanded ? "−" : "+"}
        </button>
      )}
    </div>
  );
}