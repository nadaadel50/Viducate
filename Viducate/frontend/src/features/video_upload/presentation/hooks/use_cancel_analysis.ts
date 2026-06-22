import { useState } from "react";
import { cancelAnalysisUsecase } from "../../../../core/di/video_status_container";

type State = "idle" | "loading" | "error";

export function useCancelAnalysis() {
  const [state, setState] = useState<State>("idle");

  const cancel = async (videoId: number, onSuccess: () => void) => {
    setState("loading");
    const result = await cancelAnalysisUsecase.execute(videoId);
    if (result.success) {
      onSuccess();
    } else {
      setState("error");
    }
  };

  return { cancel, isLoading: state === "loading" };
}