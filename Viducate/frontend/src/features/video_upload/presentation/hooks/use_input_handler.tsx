import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "../../../../core/constants";



export function useInputHandlers() {
  const [title, setTitle] = useState(
    () => sessionStorage.getItem(STORAGE_KEYS.title) || ""
  );

  const [textArea, setTextArea] = useState(
    () => sessionStorage.getItem(STORAGE_KEYS.description) || ""
  );

  const [error, setError] = useState(false);

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if(value.trim()==""){
      setError(true)
    }
    else{
      setError(false)
    }
    setTitle(value);
  };

  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextArea(value);
  };

 
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.title, title);
  }, [title]);

 
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.description, textArea);
  }, [textArea]);

  return {
    title,
    textArea,
    error,
    setError,
    handleTitle,
    handleTextArea,
  };
}