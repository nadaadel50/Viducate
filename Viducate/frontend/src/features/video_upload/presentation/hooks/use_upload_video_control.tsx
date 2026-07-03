import { useRef, useState } from "react";
import { useIntl } from "react-intl";

export function useUploadVideoController() {
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  const MAX_VIDEO_SIZE_MB = 500;
  const MAX_VIDEO_SIZE = MAX_VIDEO_SIZE_MB * 1024 * 1024;
  const intl=useIntl()
  

  

  const handleTakeVideo = (file: File, setTitle: (t: string) => void) => {
   
   if (file.size > MAX_VIDEO_SIZE) {
  setErrorMessage(
    intl.formatMessage(
      { id: "upload.video.maxSizeError" },
      { size: MAX_VIDEO_SIZE_MB }
    )
  );
  return;
}

    setErrorMessage(null);
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
