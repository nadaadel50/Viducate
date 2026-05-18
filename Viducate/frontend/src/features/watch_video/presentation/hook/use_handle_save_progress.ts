import { useState } from "react";

import { STORAGE_KEYS } from "../../../../core/constants";

import { useLearningSession } from "../../../../core/hooks/useLearningContent";

import { useSaveVideoProgress } from "./use_save_video";

export function useHandleSaveProgress() {
  const [toastMessage, setToastMessage] = useState("");

  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info",
  );

  const { selectedTopic, videoId, completedTopics, duration, currentTime } =
    useLearningSession();

  const { saveVideoProgress, isSavingProgress } = useSaveVideoProgress();

  function handleSaveProgress() {
    console.log("the time is",currentTime)
    if (!selectedTopic || !videoId || !duration) return;

    const bookmarks = sessionStorage.getItem(STORAGE_KEYS.marks)
      ? JSON.parse(sessionStorage.getItem(STORAGE_KEYS.marks)!)
      : [];

    saveVideoProgress(
      {
        video_id: videoId,
        completed_segment_ids: Array.from(completedTopics),
        bookmarks,
        current_time: currentTime,
        duration: duration,
      },
      {
        onSuccess: () => {
          setToastType("success");
          setToastMessage("your progress saved successfully in dashboard");
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
