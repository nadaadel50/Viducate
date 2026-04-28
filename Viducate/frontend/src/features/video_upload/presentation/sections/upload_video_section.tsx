import React from "react";
import { VideoDragedSection } from "./video_draged_section";
import { InputSection } from "../componants/input_section";
import { UploadBtn } from "../componants/upload_btn";
import { UploadSection } from "./upload_section";

import { uploadVideoUseCase } from "../../../../core/di/upload_video_container";
import { UploadVideoRequest } from "../../domain/entity/upload_video_request";

import { useUploadHandlers } from "../hooks/use_upload_handlers";
import { useNavigate } from "react-router";
import { AppRoutesNames } from "../../../../app/routers/routes";
import  { useVideoId } from "../../../../core/hooks/useVideoId";

type Props = {
  videoFile: File | null;
  

  handleTakeVideo: (file: File) => void;
  handleCancelTakenVideo: () => void;

  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  titleError: boolean;
  handleTitle: (e: React.ChangeEvent<HTMLInputElement, Element>) => void;
  title: string;

  controllerRef: React.RefObject<AbortController | null>;
  handleError: (errorMessage: string) => void;
};

export function UploadVideoSection({
  videoFile,
  handleTakeVideo,
  handleCancelTakenVideo,
  setProgress,
  setUploading,
  titleError,
  handleTitle,
  title,
  controllerRef,
  handleError,
}: Props) {
  const {
    handleBrowseClick,
    handleDragOver,
    handleFileChange,
    handleDrop,
    fileInputRef,
  } = useUploadHandlers(handleTakeVideo);
  
  const { setVideoId  } = useVideoId();
  const handleUploadVideo = async () => {
    if (!videoFile) return;

    setUploading(true);
    controllerRef.current = new AbortController();

    try {
      const response = await uploadVideoUseCase.uploadVideo(
        new UploadVideoRequest(
          videoFile,
          videoFile.name,
          title,
          "en",
          "technology",
          videoFile.type,
        ),
        (p) => setProgress(p),
        controllerRef.current.signal,
      );

      if (!response.success) {
        handleError(response.error);
        return;
      }
    

     // console.log(response.data);
       setVideoId(response.data.videoId);
      
    } catch (error) {
      if (error instanceof Error) {
        handleError(error.message);
      } else {
        handleError("Something went wrong Please try again");
      }
    } finally {
      controllerRef.current = null;
    }
  };

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
        label="Upload Video"
        onClick={handleUploadVideo}
      />
    </>
  );
}
