import { useEffect, useState } from "react";

export function useInputHandlers() {

  const [uploadTitle, setUploadTitle] = useState("");
  const [linkTitle, setLinkTitle] = useState("");

  const [isFirstUploadTyping, setIsFirstUploadTyping] = useState(true);
  const [isFirstLinkTyping, setIsFirstLinkTyping] = useState(true);

  const [uploadTitleError, setUploadTitleError] = useState(false);
  const [linkTitleError, setLinkTitleError] = useState(false);

  const handleUploadTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUploadTitle(value);
    setIsFirstUploadTyping(false);
  };

  const handleLinkTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLinkTitle(value);
    setIsFirstLinkTyping(false);
  };

  useEffect(() => {
    if (uploadTitle.trim() === "" && !isFirstUploadTyping) {
      setUploadTitleError(true);
    } else {
      setUploadTitleError(false);
    }
  }, [uploadTitle]);

  useEffect(() => {
    if (linkTitle.trim() === "" && !isFirstLinkTyping) {
      setLinkTitleError(true);
    } else {
      console.log("came here")
      setLinkTitleError(false);
    }
  }, [linkTitle]);

  return {
    uploadTitle,
    setUploadTitle,
    linkTitle,
   

    uploadTitleError,
    linkTitleError,

    handleUploadTitle,
    handleLinkTitle,
  };
}