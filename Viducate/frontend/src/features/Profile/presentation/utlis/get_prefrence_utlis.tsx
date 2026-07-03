import type { CSSProperties } from "react";

export function getPreferenceButtonStyle(
  isActive: boolean,
  primaryColor: string,
  inactiveColor: string,
): CSSProperties {
  return {
    borderColor: isActive ? primaryColor : "#f1f5f9",
    backgroundColor: isActive ? `${primaryColor}10` : "#ffffff",
    color: isActive ? primaryColor : inactiveColor,
    boxShadow: isActive ? `0 4px 14px ${primaryColor}20` : "none",
  };
}
