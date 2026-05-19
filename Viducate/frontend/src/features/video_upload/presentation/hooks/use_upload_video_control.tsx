import { useRef, useState } from "react";

export function useUploadVideoController() {
  //  STATE
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  // ACTIONS
  const handleTakeVideo = (file: File, setTitle: (t: string) => void) => {
    setVideoFile(file);
    setTitle(file.name.trim());
  };

  const handleCancelTakenVideo = (setTitle: (t: string) => void) => {
    setVideoFile(null);
    setTitle("");
  };

  const handleCancelUpload = () => {
    controllerRef.current?.abort();
    setIsUploading(false);
    setProgress(0);
  };

  const handleError = (msg: string) => {
    setErrorMessage(msg);
  };

  const clearError = () => {
    setErrorMessage(null);
  };

 
  return {
    state: {
      videoFile,
      isUploading,
      progress,
      errorMessage,
    },

    actions: {
      setProgress,
      setIsUploading,
      handleTakeVideo,
      handleCancelTakenVideo,
      handleCancelUpload,
      handleError,
      clearError,
    },

    refs: {
      controllerRef,
    },
  };
}