import { useState } from "react";
import { exportUsecase } from "../../../../core/di/summary_container";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function useExport() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = async (
    type: "summary" | "study_notes",
    videoId: number,
    segmentId?: number,
    filename?: string,
  ) => {
    setIsLoading(true);
    setError(null);

    let result;
    if (type === "summary") {
      result = segmentId
        ? await exportUsecase.downloadSegmentSummary(videoId, segmentId)
        : await exportUsecase.downloadVideoSummary(videoId);
    } else {
      result = segmentId
        ? await exportUsecase.downloadSegmentStudyNotes(videoId, segmentId)
        : await exportUsecase.downloadVideoStudyNotes(videoId);
    }

    if (result.success) {
      triggerDownload(
        result.data,
        filename ?? `${type}_${segmentId ?? videoId}.pdf`,
      );
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return { download, isLoading, error };
}
