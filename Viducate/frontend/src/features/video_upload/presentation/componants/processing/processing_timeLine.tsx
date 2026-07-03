import type { VideoStatusEntity } from "../../../domain/entity/video_status_entity";
import { AnalysisStepItem } from "./analysis_step_item";

type ProcessingTimelineProps = {
  status: VideoStatusEntity["status"];
};

export function ProcessingTimeline({ status }: ProcessingTimelineProps) {
  return (
    <div className="w-full max-w-sm bg-white/60 backdrop-blur-md rounded-xl p-4 border border-white/60 shadow-sm shadow-indigo-100/20">
      <AnalysisStepItem
        labelId="analysis.step.fetching"
        status={
          status === "failed"
            ? "failed"
            : status !== "segmenting" && status !== "completed"
              ? "active"
              : "completed"
        }
      />

      <AnalysisStepItem
        labelId="analysis.step.segmenting"
        status={
          status === "failed"
            ? "failed"
            : status === "segmenting"
              ? "active"
              : status === "completed"
                ? "completed"
                : "pending"
        }
        isLast
      />
    </div>
  );
}
