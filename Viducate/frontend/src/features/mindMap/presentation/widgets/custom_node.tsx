import { type NodeProps, Handle, Position } from "reactflow";

export function CustomNode({ data }: NodeProps) {
  return (
    <div
      style={{
        padding: "12px 18px",
        borderRadius: "14px",
        border: "2px solid #444",
        background: "white",
        minWidth: "160px",
        textAlign: "center",
        fontWeight: "bold",
        position: "relative",
      }}
    >
      {/* Top */}
      <Handle
        type="target"
        position={Position.Top}
      />

      {/* Left */}
      <Handle
        type="target"
        position={Position.Left}
      />

      <div>{data.label}</div>

      {/* Right */}
      <Handle
        type="source"
        position={Position.Right}
      />

      {/* Bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </div>
  );
}