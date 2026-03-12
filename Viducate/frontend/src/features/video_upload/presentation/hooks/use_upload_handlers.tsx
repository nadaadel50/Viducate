import { useRef, useState } from "react";


export function useUploadHandlers(setTitle:React.Dispatch<React.SetStateAction<string>>) {

 
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [takeVideo, setTakeVideo] = useState(false);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancelVideo = () => {
    if (fileInputRef) {
      setVideoFile(null);
     
    
    }
  };
   const handleCancelTakenVideo = () => {
    if (fileInputRef) {
      setVideoFile(null);
      setTakeVideo(false)
      setTitle("")
    
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setTitle(file.name.trim())
      setTakeVideo(true)
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
      setTitle(file.name.trim())
      setTakeVideo(true)
    }
  };

  return {
    handleBrowseClick,
    handleDragOver,
    handleFileChange,
    handleDrop,
    fileInputRef,
    videoFile,
    setVideoFile,
    takeVideo,
    setTakeVideo,
    handleCancelVideo,
    handleCancelTakenVideo
  };
}
