import React from "react";
import { VideoDragedSection } from "./video_draged_section";
import { InputSection } from "../componants/upload/input_section";
import { UploadBtn } from "../componants/upload/upload_btn";
import { UploadSection } from "./upload_section";
import { useIntl } from "react-intl";



import { useUploadHandlers } from "../hooks/use_upload_handlers";



type Props = {
  videoFile: File | null;

  handleTakeVideo: (file: File) => void;
  handleCancelTakenVideo: () => void;

 
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  titleError: boolean;
  handleTitle: (e: React.ChangeEvent<HTMLInputElement, Element>) => void;
  title: string;

  
  
};

export function UploadVideoSection({
  videoFile,
  handleTakeVideo,
  handleCancelTakenVideo,

  setUploading,
  titleError,
  handleTitle,
  title,
 
}: Props) {
  const {
    handleBrowseClick,
    handleDragOver,
    handleFileChange,
    handleDrop,
    fileInputRef,
  } = useUploadHandlers(handleTakeVideo);
const intl = useIntl();
  

  return (
    <>
      {videoFile ? (
        <VideoDragedSection
          videoFile={videoFile}
          handleCancel={handleCancelTakenVideo}
        />
      ) : (
        <UploadSection
          fileInputRef={fileInputRef}
          handleBrowseClick={handleBrowseClick}
          handleFileChange={handleFileChange}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
        />
      )}

      <InputSection
        title={title}
        error={titleError}
        handleTitle={handleTitle}
      />

      <UploadBtn
  disabled={!videoFile || !title}
  label={intl.formatMessage({ id: "upload.video.uploadButton" })}
  onClick={() => setUploading(true)}
/>
    </>
  );
}
