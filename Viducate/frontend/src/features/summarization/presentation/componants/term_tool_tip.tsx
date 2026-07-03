import { COLORS } from "../../../../core/constants/colors";

interface TermTooltipProps {
  text: string;
  tooltip: string;
}

export const TermTooltip = ({ text, tooltip }: TermTooltipProps) => {
  return (
    <span
      className="
        relative group cursor-pointer
        px-2 py-[2px]
        rounded-md
        font-semibold
        transition-all duration-200
        bg-yellow-100
        hover:bg-yellow-200
        text-black
      "
    >
      {text}

      {/* Tooltip */}
      <span
        className="
          absolute left-1/2 top-full z-20
          mt-3
          w-72
          -translate-x-1/2
          rounded-xl
          px-4 py-3
          text-sm font-normal
          shadow-2xl
          opacity-0
          invisible
          group-hover:visible
          group-hover:opacity-100
          transition-all duration-200
        "
        style={{
          backgroundColor: COLORS.layout.leftBackground,
          color: COLORS.text.primary,
          border: `1px solid ${COLORS.border.default}`,
        }}
      >
        {tooltip}

        {/* Arrow */}
        <span
          className="
            absolute
            -top-2 left-1/2
            -translate-x-1/2
            w-4 h-4
            rotate-45
          "
          style={{
            backgroundColor: COLORS.layout.leftBackground,
            borderLeft: `1px solid ${COLORS.border.default}`,
            borderTop: `1px solid ${COLORS.border.default}`,
          }}
        />
      </span>
    </span>
  );
};
