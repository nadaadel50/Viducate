import { UploadTitle } from "../componants/uplaod_title";
import { SelectBox } from "../componants/select_box";
import { InputSection } from "../componants/input_section";
import { useSelectBtnHandlers } from "../hooks/use_select_btn_handlers";
import { LinkSection } from "../componants/link_section";
import { UploadSection } from "../componants/upload_section";
import { UploadBtn } from "../componants/upload_btn";
import { useInputHandlers } from "../hooks/use_input_handler";
import { useLinkHandlers } from "../hooks/use_link_handler";
import { useUploadHandlers } from "../hooks/use_upload_handlers";
import { VideoDragedSection } from "../componants/video_draged_section";
import { UploadLoadingSection } from "../componants/upload_loading_section";
import { useState } from "react";

export function UploadVideoPage() {
  const { handleSelected, selected } = useSelectBtnHandlers();

  const {
    uploadTitle,
    setUploadTitle,
    linkTitle,
    uploadTitleError,
    linkTitleError,
    handleUploadTitle,
    handleLinkTitle,
  } = useInputHandlers();

  const { url, handleUrlChange, linkError, handlePaste } = useLinkHandlers();

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
              <SelectBox
                handleSelected={handleSelected}
                selected={selected}
              />
            )}

            {selected === "link" ? (
              <LinkSection
                url={url}
                error={linkError}
                handleUrlChange={handleUrlChange}
                handlePaste={handlePaste}
              />
            ) : isUploading ? (
              <UploadLoadingSection
                title={uploadTitle}
                handleCancel={handleCancelUploadedVideo}
              />
            ) : takeVideo ? (
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

            {selected === "link" ? (
              <InputSection
                title={linkTitle}
                error={linkTitleError}
                handleTitle={handleLinkTitle}
              />
            ) : (
              <InputSection
                title={uploadTitle}
                error={uploadTitleError}
                handleTitle={handleUploadTitle}
              />
            )}

            <UploadBtn
              videoLink={url}
              linkVideoTitle={linkTitle}
              uploadedVideoTitle={uploadTitle}
              videoLinkError={linkError}
              videoFile={videoFile}
              selected={selected}
              onUploadClick={handleUploadClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}