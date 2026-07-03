import { useState } from "react";
import type { VideoStudyNotes } from "../../domain/entity/study_notes_entity";
import { getVideoStudyNotesUsecase } from "../../../../core/di/summary_container";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: VideoStudyNotes }
  | { status: "error"; message: string };

export function useVideoStudyNotes() {
  const [state, setState] = useState<State>({ status: "idle" });

  const fetch = async (videoId: number) => {
    setState({ status: "loading" });
    const result = await getVideoStudyNotesUsecase.execute(videoId);
    if (result.success) {
      setState({ status: "success", data: result.data });
    } else {
      setState({ status: "error", message: result.error });
    }
  };

  return { state, fetch };
}
