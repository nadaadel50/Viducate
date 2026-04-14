
import { useEffect, useState } from "react";

export function useUploadTitleInput(videoFile:File|null) {
  const [uploadTitle, setUploadTitle] = useState("");
  const [isFirstUploadTyping, setIsFirstUploadTyping] = useState(true);
  const [uploadTitleError, setUploadTitleError] = useState(false);

  const handleUploadTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUploadTitle(value);
    setIsFirstUploadTyping(false);
  };

  useEffect(() => {
    if (uploadTitle.trim() === "" && !isFirstUploadTyping) {
      setUploadTitleError(true);
    } else {
      setUploadTitleError(false);
    }
  }, [uploadTitle, isFirstUploadTyping]);

  useEffect(() => {
  if (videoFile) {
    setUploadTitle(videoFile.name.trim());
  }
  else{
    setUploadTitle("")
  }
}, [videoFile]);

  return {
    uploadTitle,
    setUploadTitle,
    uploadTitleError,
    handleUploadTitle,
    setIsFirstUploadTyping,
  };
}
