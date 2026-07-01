import { useRef } from "react";

export function useUploadHandlers(
  onVideoSelected: (file: File) => void
) {

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  onVideoSelected(file);


  e.currentTarget.value = "";
};
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    onVideoSelected(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return {
    fileInputRef,
    handleBrowseClick,
    handleFileChange,
    handleDrop,
    handleDragOver,
  };
}