import { useState } from "react";
import type { VideoReport } from "../../domain/entity/report_entity";
import { getVideoReportUsecase } from "../../../../core/di/report_container";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: VideoReport }
  | { status: "error"; message: string };

export function useVideoReport() {
  const [state, setState] = useState<State>({ status: "idle" });

  const fetch = async (videoId: number) => {
    setState({ status: "loading" });
    const result = await getVideoReportUsecase.execute(videoId);
    if (result.success) {
      setState({ status: "success", data: result.data });
    } else {
      setState({ status: "error", message: result.error });
    }
  };

  return { state, fetch };
}
