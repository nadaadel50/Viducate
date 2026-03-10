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

export function UploadVideoPage() {
  const { handleSelected, selected } = useSelectBtnHandlers();

  const {
    title,
    textArea,
    error: titleError,
    handleTextArea,
    handleTitle,
  } = useInputHandlers();

  const { url, handleUrlChange, linkError, handlePaste } = useLinkHandlers();

  const {
    handleBrowseClick,
    handleDragOver,
    handleFileChange,
    handleDrop,
    fileInputRef,
    videoFile
  } = useUploadHandlers();

  return (
    <div className="  flex justify-center items-center bg-[#f3f4f6] min-h-screen p-12 font-display">
      <div className=" w-250 min-h-screen ">
        <UploadTitle
          bigTitle={"New Analysis"}
          smallTitle={
            "Upload a lecture recording or paste a link to get started."
          }
        />

        <div className=" flex justify-center items-center mt-10 bg-white rounded-xl  ">
          <div className="m-10 w-full flex flex-col items-center">
            <SelectBox handleSelected={handleSelected} selected={selected} />
            {selected === "link" ? (
              <LinkSection
                url={url}
                error={linkError}
                handleUrlChange={handleUrlChange}
                handlePaste={handlePaste}
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
              handleTextArea={handleTextArea}
              textArea={textArea}
            />
            <UploadBtn videoLink={url} videoTitle={title} linkError={linkError} titleError={titleError} videoFile={videoFile} />
          </div>
        </div>
      </div>
    </div>
  );
}
