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
        backgroundColor: disabled
          ? COLORS.button.disabled
          : COLORS.button.primary,
        color: COLORS.background.light,
      }}
      className="
        w-full
        h-10 sm:h-11
        px-4
        rounded-lg
        text-sm
        font-semibold
        transition-all
        duration-200
        cursor-pointer
        disabled:cursor-not-allowed
        shadow-md
        hover:shadow-lg
      "
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor =
            COLORS.button.primaryHover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor =
            COLORS.button.primary;
        }
      }}
    >
      {children}
    </button>
  );
}