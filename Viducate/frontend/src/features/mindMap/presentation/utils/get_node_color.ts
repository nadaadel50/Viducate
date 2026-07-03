export function getNodeStyle(type: string) {
  switch (type) {
    case "root":
      return {
        background: "linear-gradient(145deg, #dbeafe 0%, #bfdbfe 100%)",
        color: "#1e3a8a",
        border: "1.5px solid rgba(59, 130, 246, 0.35)",
        boxShadow:
          "0 6px 20px rgba(59, 130, 246, 0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
      };

    case "segment":
      return {
        background: "linear-gradient(145deg, #ede9fe 0%, #ddd6fe 100%)",
        color: "#4c1d95",
        border: "1.5px solid rgba(139, 92, 246, 0.35)",
        boxShadow:
          "0 6px 20px rgba(139, 92, 246, 0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
      };

    case "subtopic":
      return {
        background: "linear-gradient(145deg, #d1fae5 0%, #a7f3d0 100%)",
        color: "#064e3b",
        border: "1.5px solid rgba(16, 185, 129, 0.35)",
        boxShadow:
          "0 6px 20px rgba(16, 185, 129, 0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
      };

    case "detail":
      return {
        background: "linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%)",
        color: "#1e293b",
        border: "1.5px solid rgba(100, 116, 139, 0.3)",
        boxShadow:
          "0 6px 20px rgba(100, 116, 139, 0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
      };

    case "keypoint":
      return {
        background: "linear-gradient(145deg, #fef3c7 0%, #fde68a 100%)",
        color: "#78350f",
        border: "1.5px solid rgba(245, 158, 11, 0.35)",
        boxShadow:
          "0 6px 20px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(255,255,255,0.9)",
      };

    default:
      return {
        background: "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)",
        color: "#374151",
        border: "1.5px solid rgba(100, 116, 139, 0.2)",
        boxShadow:
          "0 4px 14px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255,255,255,0.95)",
      };
  }
}
