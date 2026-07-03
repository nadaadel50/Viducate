import { useState } from "react";
import type { SegmentSummary } from "../../domain/entity/summary_entity";
import { getSegmentSummaryUsecase } from "../../../../core/di/summary_container";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: SegmentSummary }
  | { status: "error"; message: string };

export function useSegmentSummary() {
  const [state, setState] = useState<State>({ status: "idle" });

  const fetch = async (videoId: number, segmentId: number) => {
    setState({ status: "loading" });
    const result = await getSegmentSummaryUsecase.execute(videoId, segmentId);
    if (result.success) {
      setState({ status: "success", data: result.data });
    } else {
      setState({ status: "error", message: result.error });
    }
  };

  return { state, fetch };
}
