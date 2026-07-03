import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import { FONT_STYLES } from "../constants/fonts";

type CustomButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: CSSProperties;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
};

export function CustomButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  className,
  style,
  leftIcon,
  rightIcon,
  fullWidth = false,
}: CustomButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 transition-all duration-200  active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 sm:px-5",
        FONT_STYLES.button,
        fullWidth && "w-full",
        className,
      )}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
