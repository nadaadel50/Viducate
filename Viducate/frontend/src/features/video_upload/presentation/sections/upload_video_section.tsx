import { useRef } from "react";

import { VideoDragedSection } from "./video_draged_section";
import { InputSection } from "../componants/input_section";
import { UploadBtn } from "../componants/upload_btn";
import { UploadSection } from "./upload_section";

import { uploadVideoUseCase } from "../../../../core/di/upload_video_container";
import { UploadVideoRequest } from "../../domain/entity/upload_video_request";

import { useUploadHandlers } from "../hooks/use_upload_handlers";

type Props = {
  videoFile: File | null;
  takeVideo: boolean;

  handleTakeVideo: (file: File) => void;
  handleCancelTakenVideo: () => void;

  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  titleError:boolean,
  handleTitle:(e: React.ChangeEvent<HTMLInputElement, Element>) => void
    title: string;
};

export function UploadVideoSection({
  videoFile,
  takeVideo,
  handleTakeVideo,
  handleCancelTakenVideo,
  setProgress,
  setUploading,
  titleError,
  handleTitle,
  title
}: Props) {

  const abortController = useRef<AbortController | null>(null);

  const {
    handleBrowseClick,
    handleDragOver,
    handleFileChange,
    handleDrop,
    fileInputRef,
  } = useUploadHandlers(handleTakeVideo);

  const handleUploadVideo = async () => {
    if (!videoFile) return;

    setUploading(true);
    abortController.current = new AbortController();

    try {
      const response = await uploadVideoUseCase.uploadVideo(
        new UploadVideoRequest(
          videoFile,
          videoFile.name,
          title,
          "en",
          "technology",
          videoFile.type
        ),
        (p) => setProgress(p),
        abortController.current.signal
      );

      if (!response.success) {
        console.log(response.error);
        return;
      }

      console.log(response.data);

    } catch (error) {
      console.log(error);
    } finally {
     
      abortController.current = null;
    }
  };

  return (
    <>
      {takeVideo ? (
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

      <InputSection title={title} error={titleError} handleTitle={handleTitle}/>

      <UploadBtn
        disabled={!videoFile||!title}
        label="Upload Video"
        onClick={handleUploadVideo}
      />
    </>
  );
}