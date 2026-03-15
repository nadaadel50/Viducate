import { UploadTitle } from "../componants/uplaod_title";
import { SelectBox } from "../componants/select_box";

import { useSelectBtnHandlers } from "../hooks/use_select_btn_handlers";

import { useRef, useState } from "react";

import { useUploadTitleInput } from "../hooks/use_upload_input_handler";
import { UploadLinkSection } from "../sections/upload_link_section";
import { UploadLoadingSection } from "../sections/upload_loading_section";
import { UploadVideoSection } from "../sections/upload_video_section";
export function UploadVideoPage() {
  const { handleSelected, selected } = useSelectBtnHandlers();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
 const takeVideo = !!videoFile;

  const controllerRef = useRef<AbortController | null>(null);

  const { uploadTitle, uploadTitleError, handleUploadTitle, setUploadTitle } =
    useUploadTitleInput(videoFile);

  const handleTakeVideo = (file: File) => {
    setVideoFile(file);
   
    setUploadTitle(file.name.trim());
  };

  const handleCancelTakenVideo = () => {
    setVideoFile(null);
    setUploadTitle("");
  };

  const handleCancelUploadedVideo = async () => {
    controllerRef.current?.abort();

    setIsUploading(false);
    setProgress(0);
  };

  function renderUploadContent() {
    if (selected === "link") {
      return <UploadLinkSection />;
    }

    if (isUploading) {
      return (
        <UploadLoadingSection
          progress={progress}
          title={uploadTitle}
          handleCancel={handleCancelUploadedVideo}
        />
      );
    }

    return (
      <UploadVideoSection
        videoFile={videoFile}
        takeVideo={takeVideo}
        handleTakeVideo={handleTakeVideo}
        handleCancelTakenVideo={handleCancelTakenVideo}
        setProgress={setProgress}
        setUploading={setIsUploading}
        handleTitle={handleUploadTitle}
        titleError={uploadTitleError}
        title={uploadTitle}
      />
    );
  }

  return (
    <div className="flex justify-center items-center bg-[#f3f4f6] min-h-screen p-12 font-display">
      <div className="w-250 min-h-screen">
        <UploadTitle
          bigTitle={"New Analysis"}
          smallTitle={
            "Upload a lecture recording or paste a link to get started."
          }
        />

        <div className="flex justify-center items-center mt-10 bg-white rounded-xl">
          <div className="m-10 w-full flex flex-col items-center">
            {!isUploading && (
              <SelectBox handleSelected={handleSelected} selected={selected} />
            )}

            {renderUploadContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
