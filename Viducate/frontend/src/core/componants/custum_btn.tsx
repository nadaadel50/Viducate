import { COLORS } from "../constants/colors";

type CustomButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export function CustomButton({
  children,
  onClick,
  disabled = false,
  type = "button",
}: CustomButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? COLORS.disabled : COLORS.PrimaryColor,
        color: COLORS.light,
      }}
      className="w-full rounded-xl h-12 px-4 font-bold transition cursor-pointer disabled:cursor-not-allowed shadow-xl"
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = COLORS.PrimaryHover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = COLORS.PrimaryColor;
        }
      }}
    >
      {children}
    </button>
  );
}