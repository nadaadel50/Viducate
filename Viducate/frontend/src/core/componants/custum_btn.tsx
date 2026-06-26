
import type { ReactNode } from "react";
import { COLORS } from "../constants/colors";
import { FONT_STYLES } from "../constants/fonts";
import clsx from "clsx";

type CustomButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: React.CSSProperties;
  variant?: "primary" | "danger" | "outline";
};

export function CustomButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  className,
  variant = "primary",
  style
}: CustomButtonProps) {
  const backgroundColor = () => {
    if (disabled) return COLORS.button.disabled;

    switch (variant) {
      case "danger":
        return "#e11d48";

      case "outline":
        return "transparent";

      default:
        return COLORS.button.primary;
    }
  };

  const textColor =
    variant === "outline"
      ? COLORS.button.primary
      : COLORS.background.light;

  const borderColor = variant==="outline"?COLORS.button.primary: "transparent";

  

  return (
    <button

      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: backgroundColor(),
        color: textColor,
        border: `1px solid ${borderColor}`,
        ...style
      }}
      className={clsx(
        `
        inline-flex
        items-center
        justify-center
        gap-2
        px-5
        py-2.5
        rounded-xl
        transition-all
        duration-200
        shadow-md
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-70
        cursor-pointer
        
        `,
        FONT_STYLES.button,
        className
      )}
      onMouseEnter={(e) => {
        if (disabled) return;

        switch (variant) {
          case "primary":
            e.currentTarget.style.backgroundColor =
              COLORS.button.primaryHover;
            break;

          case "danger":
            e.currentTarget.style.backgroundColor = "#be123c";
            break;

          case "outline":
            e.currentTarget.style.backgroundColor =
              `${COLORS.button.primary}10`;
            break;
        }
      }}
      onMouseLeave={(e) => {
        if (disabled) return;

        e.currentTarget.style.backgroundColor = backgroundColor();
      }}
    >
      {children}
    </button>
  );
}