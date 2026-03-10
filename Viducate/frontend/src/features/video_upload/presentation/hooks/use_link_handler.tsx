import { useEffect, useState } from "react";

export function useLinkHandlers() {
  const [url, setUrl] = useState("");
  const [linkError, setError] = useState(false);

  function isValidUrl(value: string) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);

    setError(!isValidUrl(value));
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
  if (url) {
    setError(!isValidUrl(url));
  }
}, [url]);


  return {
    url,
    setUrl,
    handlePaste,
    handleUrlChange,
    linkError,
    setError,
  };
}
