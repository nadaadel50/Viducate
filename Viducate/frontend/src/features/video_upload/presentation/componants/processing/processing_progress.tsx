import { useMemo } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { COLORS } from "../../../../../core/constants/colors";
import type { VideoStatusEntity } from "../../../domain/entity/video_status_entity";

type ProcessingProgressProps = {
  status: VideoStatusEntity["status"];
  progress: number;
};

export function ProcessingProgress({
  status,
  progress,
}: ProcessingProgressProps) {
  const ringGradient = useMemo(
    () => ({
      background:
        status === "failed"
          ? `conic-gradient(from 0deg, ${COLORS.state.error} 0%, ${COLORS.state.error} 100%)`
          : status === "completed"
            ? `conic-gradient(from 0deg, ${COLORS.state.success} 0%, ${COLORS.state.success} 100%)`
            : `conic-gradient(from 0deg, ${COLORS.brand.primary} 0%, ${COLORS.brand.secondary} ${progress}%, ${COLORS.effects.ringEmpty} ${progress}%)`,
    }),
    [progress, status],
  );

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 bg-indigo-100/30 rounded-full blur-3xl scale-150 animate-pulse" />

      <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full p-3 bg-white shadow-xl flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full opacity-20 transition-all duration-500"
          style={ringGradient}
        />

        <div className="flex flex-col items-center text-center">
          {status === "failed" ? (
            <XCircle
              size={40}
              className="md:w-12 md:h-12 text-red-500 animate-in zoom-in duration-500"
            />
          ) : status === "completed" ? (
            <CheckCircle
              size={40}
              className="md:w-12 md:h-12 text-green-500 animate-in zoom-in duration-500"
            />
          ) : (
            <span
              className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter"
              style={{
                color: COLORS.brand.primary,
              }}
            >
              {progress}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
