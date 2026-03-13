import { VideoDragedSection } from "./video_draged_section";
import { InputSection } from "../componants/input_section";
import { UploadBtn } from "../componants/upload_btn";
import { UploadSection } from "./upload_section";
import { uploadVideoUseCase } from "../../../../core/di/upload_video_container";
import { UploadVideoRequest } from "../../domain/entity/upload_video_request";

type Props = {
  uploadTitle: string;
  uploadTitleError: boolean;
  handleUploadTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;

  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleBrowseClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;

  videoFile: File | null;
  takeVideo: boolean;
  handleCancelTakenVideo: () => void;
  
};

export function UploadVideoSection({
  uploadTitle,
  uploadTitleError,
  handleUploadTitle,

  fileInputRef,
  handleBrowseClick,
  handleFileChange,
  handleDragOver,
  handleDrop,

  videoFile,
  takeVideo,
  handleCancelTakenVideo,
}: Props) {
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

      <InputSection
        title={uploadTitle}
        error={uploadTitleError}
        handleTitle={handleUploadTitle}
      />

      <UploadBtn
        disabled={!videoFile || uploadTitle === ""}
        label="Upload Video"
        onClick={async() => {
          if (!videoFile) {
            return;
          }

          const response = await uploadVideoUseCase.uploadVideo(
            new UploadVideoRequest(
              videoFile,
              videoFile.name,
              uploadTitle,
              "en",
              "technology",
              videoFile.type,
            ),
          );
          if(response.success){
            console.log(response.data)

          }
          else{
            console.log(response.error)
          }
        }}
      />
    </>
  );
}
