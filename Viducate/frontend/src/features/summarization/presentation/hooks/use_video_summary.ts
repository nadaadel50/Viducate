import { useState } from "react";
import type { VideoSummary } from "../../domain/entity/summary_entity";
import { getVideoSummaryUsecase } from "../../../../core/di/summary_container";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: VideoSummary }
  | { status: "error"; message: string };

export function useVideoSummary() {
  const [state, setState] = useState<State>({ status: "idle" });

  const fetch = async (videoId: number) => {
    setState({ status: "loading" });
    const result = await getVideoSummaryUsecase.execute(videoId);
    if (result.success) {
      setState({ status: "success", data: result.data });
    } else {
      setState({ status: "error", message: result.error });
    }
  };

  return { state, fetch };
}
