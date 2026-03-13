import { UploadTitle } from "../componants/uplaod_title";
import { SelectBox } from "../componants/select_box";

import { useSelectBtnHandlers } from "../hooks/use_select_btn_handlers";


import { useState } from "react";

import { useUploadTitleInput } from "../hooks/use_upload_input_handler";
import { useUploadHandlers } from "../hooks/use_upload_handlers";
import { UploadLinkSection } from "../sections/upload_link_section";
import { UploadLoadingSection } from "../sections/upload_loading_section";
import { UploadVideoSection } from "../sections/upload_video_section";

export function UploadVideoPage() {
  const { handleSelected, selected } = useSelectBtnHandlers();

  const { uploadTitle, uploadTitleError, handleUploadTitle, setUploadTitle } =
    useUploadTitleInput();

  const {
    handleBrowseClick,
    handleDragOver,
    handleFileChange,
    handleDrop,
    fileInputRef,
    videoFile,
    takeVideo,
    handleCancelTakenVideo,
  } = useUploadHandlers(setUploadTitle);

  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = () => {
    setIsUploading(true);
  };

  const handleCancelUploadedVideo = () => {
    setIsUploading(false);
  };

  function renderUploadContent() {
    if (selected === "link") {
      return <UploadLinkSection />;
    }

    if (isUploading) {
      return (
        <UploadLoadingSection
          title={uploadTitle}
          handleCancel={handleCancelUploadedVideo}
        />
      );
    }

    return (
      <UploadVideoSection
        takeVideo={takeVideo}
        videoFile={videoFile}
        uploadTitle={uploadTitle}
        uploadTitleError={uploadTitleError}
        handleUploadTitle={handleUploadTitle}
        handleBrowseClick={handleBrowseClick}
        handleDragOver={handleDragOver}
        handleFileChange={handleFileChange}
        handleDrop={handleDrop}
        fileInputRef={fileInputRef}
        handleCancelTakenVideo={handleCancelTakenVideo}
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
