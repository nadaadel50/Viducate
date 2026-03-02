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
        backgroundColor: disabled ? COLORS.button.disabled : COLORS.button.primary,
        color: COLORS.text.white,
      }}
      className="w-full rounded-xl h-12 px-4 font-bold transition cursor-pointer disabled:cursor-not-allowed shadow-xl"
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = COLORS.button.primaryHover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = COLORS.button.primary;
        }
      }}
    >
      {children}
    </button>
  );
}