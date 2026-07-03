import { CheckCircle, RefreshCw, Circle, XCircle } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { COLORS } from "../../../../../core/constants/colors";
import { FONT_STYLES } from "../../../../../core/constants/fonts";

interface StepProps {
  labelId: string;
  status: "pending" | "active" | "completed" | "failed";
  isLast?: boolean;
}

export const AnalysisStepItem = ({ labelId, status, isLast }: StepProps) => {
  const isCompleted = status === "completed";
  const isActive = status === "active";
  const isFailed = status === "failed";

  const getColors = () => {
    if (isCompleted) {
      return {
        icon: COLORS.state.success,
        text: COLORS.state.success,
        line: COLORS.state.success,
      };
    }

    if (isActive) {
      return {
        icon: COLORS.brand.primary,
        text: COLORS.brand.primary,
        line: COLORS.border.default,
      };
    }

    if (isFailed) {
      return {
        icon: COLORS.state.error,
        text: COLORS.state.error,
        line: COLORS.state.error,
      };
    }

    return {
      icon: COLORS.text.muted,
      text: COLORS.text.muted,
      line: COLORS.border.default,
    };
  };

  const activeColors = getColors();

  return (
    <div className="grid grid-cols-[32px_1fr] md:grid-cols-[36px_1fr] gap-x-2">
      {/* Icon Section */}
      <div className="flex flex-col items-center pt-0.5">
        <div
          className={`transition-all duration-300 ${
            isActive ? "scale-105" : ""
          }`}
          style={{ color: activeColors.icon }}
        >
          {isFailed ? (
            <XCircle size={20} className="md:w-6 md:h-6" />
          ) : isCompleted ? (
            <CheckCircle size={20} className="md:w-6 md:h-6" />
          ) : isActive ? (
            <RefreshCw className="animate-spin md:w-6 md:h-6" size={20} />
          ) : (
            <Circle size={20} className="md:w-6 md:h-6" />
          )}
        </div>

        {!isLast && (
          <div
            className="w-[2px] h-8 md:h-10 mt-1 transition-colors duration-500"
            style={{
              backgroundColor: isCompleted
                ? COLORS.state.success
                : COLORS.border.default,
            }}
          />
        )}
      </div>

      {/* Text Section */}
      <div className={`flex flex-col ${!isLast ? "pb-4" : ""}`}>
        <p
          className={`${FONT_STYLES.body} font-semibold`}
          style={{
            color:
              isCompleted || isActive ? COLORS.text.primary : COLORS.text.muted,
          }}
        >
          <FormattedMessage id={labelId} />
        </p>

        <span
          className="text-[10px] md:text-xs font-semibold uppercase tracking-wide mt-0.5"
          style={{ color: activeColors.text }}
        >
          <FormattedMessage id={`analysis.${status}`} defaultMessage={status} />
        </span>
      </div>
    </div>
  );
};
