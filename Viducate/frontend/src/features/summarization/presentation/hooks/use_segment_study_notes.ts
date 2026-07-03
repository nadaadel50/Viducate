import { useState } from "react";
import type { SegmentStudyNotes } from "../../domain/entity/study_notes_entity";
import { getSegmentStudyNotesUsecase } from "../../../../core/di/summary_container";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: SegmentStudyNotes }
  | { status: "error"; message: string };

export function useSegmentStudyNotes() {
  const [state, setState] = useState<State>({ status: "idle" });

  const fetch = async (videoId: number, segmentId: number) => {
    setState({ status: "loading" });
    const result = await getSegmentStudyNotesUsecase.execute(
      videoId,
      segmentId,
    );
    if (result.success) {
      setState({ status: "success", data: result.data });
    } else {
      setState({ status: "error", message: result.error });
    }
  };

  return { state, fetch };
}
