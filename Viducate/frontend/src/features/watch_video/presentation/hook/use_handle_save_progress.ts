import { useRef, useState } from "react";

import { useLearningSession } from "../../../../core/hooks/useLearningContent";

import { useSaveVideoProgress } from "./use_save_video";

export function useHandleSaveProgress() {
  const [toastMessage, setToastMessage] = useState("");

  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info",
  );

  const { videoId, completedTopics, duration, currentTime, marks } =
    useLearningSession();

  const { saveVideoProgress, isSavingProgress } = useSaveVideoProgress();
  const isAutoSave = useRef(false);

  function handleSaveProgress() {
    saveVideoProgress(
      {
        video_id: videoId!,
        completed_segment_ids: Array.from(completedTopics),
        bookmarks: marks,
        current_time: currentTime,
        duration: duration!,
      },
      {
        onSuccess: () => {
          setToastType("success");
          if (!isAutoSave.current) {
            setToastMessage("your progress saved successfully in dashboard");
          }

          isAutoSave.current = false;
        },
        onError: () => {
          setToastType("error");
          setToastMessage("Failed to save video progress");
        },
      },
    );
  }

  return {
    handleSaveProgress,

    isSavingProgress,

    toastMessage,

    toastType,

    clearToast: () => setToastMessage(""),
  };
}
