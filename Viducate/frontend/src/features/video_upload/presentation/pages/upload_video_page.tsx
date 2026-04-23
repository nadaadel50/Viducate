import { UploadTitle } from "../componants/uplaod_title";
import { SelectBox } from "../componants/select_box";
import { useSelectBtnHandlers } from "../hooks/use_select_btn_handlers";

import { useUploadTitleInput } from "../hooks/use_upload_input_handler";

import { UploadLinkSection } from "../sections/upload_link_section";
import { UploadLoadingSection } from "../sections/upload_loading_section";
import { UploadVideoSection } from "../sections/upload_video_section";

import { CustumError } from "../../../../core/componants/custum_error";
import { useUploadVideoController } from "../hooks/use_upload_video_control";




export function UploadVideoPage() {
  const { handleSelected, selected } = useSelectBtnHandlers();

  const { state, actions, refs } = useUploadVideoController();


  const {
    uploadTitle,
    uploadTitleError,
    handleUploadTitle,
    setUploadTitle,
    setIsFirstUploadTyping
  } = useUploadTitleInput(state.videoFile);

  const handleCancelTakeVideo=()=>{
     actions.handleCancelTakenVideo(setUploadTitle)
     setIsFirstUploadTyping(true)
     

  }

  function renderUploadContent() {
    if (selected === "link") {
      return (
        <UploadLinkSection handleError={actions.handleError} />
      );
    }

    if (state.isUploading) {
      return (
        <UploadLoadingSection
          progress={state.progress}
          title={uploadTitle}
          handleCancel={actions.handleCancelUpload}
        />
      );
    }

    return (
      <UploadVideoSection
        videoFile={state.videoFile}
        handleTakeVideo={(file) =>
          actions.handleTakeVideo(file, setUploadTitle)
        }
        handleCancelTakenVideo={handleCancelTakeVideo
        }
        setProgress={actions.setProgress}
        setUploading={actions.setIsUploading}
        handleTitle={handleUploadTitle}
        titleError={uploadTitleError}
        title={uploadTitle}
        controllerRef={refs.controllerRef}
        handleError={actions.handleError}
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

        <div className="relative flex justify-center items-center mt-10 bg-white rounded-xl">

     
          {state.errorMessage && (
            <CustumError
              apiError={state.errorMessage}
              clearError={actions.clearError}
            />
          )}

          <div className="m-15 w-full flex flex-col items-center">
            
            {!state.isUploading && (
              <SelectBox
                handleSelected={handleSelected}
                selected={selected}
              />
            )}

            {renderUploadContent()}
          </div>
        </div>
      </div>
    </div>
  );
}