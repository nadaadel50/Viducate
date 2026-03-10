import { useRef, useState } from "react";

export function useUploadHandlers() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
  
    const handleBrowseClick = () => {
      fileInputRef.current?.click();
    };
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setVideoFile(file);
      }
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };
  
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
  
      const file = e.dataTransfer.files?.[0];
  
      if (file) {
        setVideoFile(file);
      }
    };

    return{
      handleBrowseClick,
      handleDragOver,
      handleFileChange,
      handleDrop,
      fileInputRef,videoFile,setVideoFile
    }
}
