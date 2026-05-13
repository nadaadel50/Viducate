  import { type NodeProps, Handle, Position } from "reactflow";
  import { getNodeStyle } from "../utils/get_node_color";

  export function CustomNode({ data }: NodeProps) {
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
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px) scale(1.02)";
          (e.currentTarget as HTMLDivElement).style.filter = "brightness(1.08)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0) scale(1)";
          (e.currentTarget as HTMLDivElement).style.filter = "brightness(1)";
        }}
      >
        {/* Top handle */}
        <Handle
          type="target"
          position={Position.Top}
          style={{
            width: 10,
            height: 10,
            background: "rgba(255,255,255,0.6)",
            border: "2px solid rgba(255,255,255,0.9)",
            top: -5,
          }}
        />

        
        {data.type && data.type !== "default" && (
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
        )}

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

      
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            width: 10,
            height: 10,
            background: "rgba(255,255,255,0.6)",
            border: "2px solid rgba(255,255,255,0.9)",
            bottom: -5,
          }}
        />
      </div>
    );
  }