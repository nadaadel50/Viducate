import { Handle, Position, type NodeProps } from "reactflow";
import clsx from "clsx";

import {
  FONT_SIZE,
  FONT_WEIGHT,
  LETTER_SPACING,
  LINE_HEIGHT,
} from "../../../../core/constants/fonts_update";

import type { MindMapNodeType } from "../../domain/entity/node_type";
import { getNodeStyle } from "../utils/get_node_color";

type CustomNodeData = {
  label: string;
  type: MindMapNodeType;
  isRoot: boolean;
  expanded: boolean;
  parentId: string | null;
  hasChildren: boolean;
  onToggle?: (nodeId: string) => void;
};

const HANDLE_STYLE = {
  width: 10,
  height: 10,
  background: "rgba(255,255,255,0.6)",
  border: "2px solid rgba(255,255,255,0.9)",
} as const;

const HANDLES = [
  {
    id: "top",
    position: Position.Top,
    offset: { top: -5 },
  },
  {
    id: "bottom",
    position: Position.Bottom,
    offset: { bottom: -5 },
  },
  {
    id: "left",
    position: Position.Left,
    offset: { left: -5 },
  },
  {
    id: "right",
    position: Position.Right,
    offset: { right: -5 },
  },
] as const;

export function CustomNode({ id, data }: NodeProps<CustomNodeData>) {
  const nodeStyle = getNodeStyle(data.type);

  const hasToggle = !data.isRoot && data.hasChildren;

  return (
    <div
      className={clsx(
        "relative max-w-[240px] min-w-[180px] cursor-default rounded-[20px] px-5 py-4 text-center transition-all duration-150 hover:-translate-y-0.5 hover:scale-[1.02]",
      )}
      style={nodeStyle}
    >
      {HANDLES.map((handle) => (
        <>
          <Handle
            key={`${handle.id}-source`}
            id={handle.id}
            type="source"
            position={handle.position}
            style={{
              ...HANDLE_STYLE,
              ...handle.offset,
            }}
          />

          <Handle
            key={`${handle.id}-target`}
            id={handle.id}
            type="target"
            position={handle.position}
            style={{
              ...HANDLE_STYLE,
              ...handle.offset,
            }}
          />
        </>
      ))}

      <div
        className={clsx(
          FONT_SIZE.size12,
          FONT_WEIGHT.bold,
          LETTER_SPACING.widest,
          "mb-1 uppercase opacity-70",
        )}
      >
        {data.type === "segment" ? "Topic" : data.type}
      </div>

      <div
        className={clsx(
          data.type === "root" ? FONT_SIZE.size20 : FONT_SIZE.size15,
          FONT_WEIGHT.bold,
          LINE_HEIGHT.relaxed,
        )}
      >
        {data.label}
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-[20px]"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
        }}
      />

      {hasToggle && data.onToggle && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();

            if (data.onToggle) {
              data.onToggle(id);
            }
          }}
          className={clsx(
            "absolute -right-2.5 -top-2.5 z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 text-base transition-colors",
          )}
          style={{
            borderColor: "rgba(255,255,255,0.9)",
            background: data.expanded
              ? "rgba(255,255,255,0.9)"
              : "rgba(255,255,255,0.3)",
            color: data.expanded ? "#085041" : "#fff",
          }}
        >
          {data.expanded ? "−" : "+"}
        </button>
      )}
    </div>
  );
}
