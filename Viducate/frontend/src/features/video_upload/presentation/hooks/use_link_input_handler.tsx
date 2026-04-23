import { useEffect, useState } from "react";

export function useLinkTitleInput() {
  const [linkTitle, setLinkTitle] = useState("");
  const [isFirstLinkTyping, setIsFirstLinkTyping] = useState(true);
  const [linkTitleError, setLinkTitleError] = useState(false);

  const handleLinkTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLinkTitle(value);
    setIsFirstLinkTyping(false);
  };

  useEffect(() => {
    if (linkTitle.trim() === "" && !isFirstLinkTyping) {
      setLinkTitleError(true);
    } else {
      setLinkTitleError(false);
    }
  }, [linkTitle, isFirstLinkTyping]);

  return {
    linkTitle,
    linkTitleError,
    handleLinkTitle,
    setIsFirstLinkTyping,
  };
}