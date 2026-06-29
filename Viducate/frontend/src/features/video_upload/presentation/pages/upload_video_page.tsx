import { SelectBox } from "../componants/upload/select_box";
import { useSelectBtnHandlers } from "../hooks/use_select_btn_handlers";

import { useUploadTitleInput } from "../hooks/use_upload_input_handler";

import { UploadLinkSection } from "../sections/upload_link_section";
import { UploadLoadingSection } from "../sections/upload_loading_section";
import { UploadVideoSection } from "../sections/upload_video_section";

import { CustumError } from "../../../../core/componants/custum_error";
import { useUploadVideoController } from "../hooks/use_upload_video_control";
import { COLORS } from "../../../../core/constants";
import MainText from "../../../../core/componants/text_section";
import { FormattedMessage } from "react-intl";

export function UploadVideoPage() {
  const { handleSelected, selected } = useSelectBtnHandlers();

  const { state, actions, refs } = useUploadVideoController();

  const {
    uploadTitle,
    uploadTitleError,
    handleUploadTitle,
    setUploadTitle,
    setIsFirstUploadTyping,
  } = useUploadTitleInput(state.videoFile);

  const handleCancelTakeVideo = () => {
    actions.handleCancelTakenVideo(setUploadTitle);
    setIsFirstUploadTyping(true);
  };

  function renderUploadContent() {
    if (selected === "link") {
      return <UploadLinkSection />;
    }

    if (state.isUploading) {
      return (
        <UploadLoadingSection
          progress={state.progress}
          title={uploadTitle}
          handleCancel={actions.handleCancelUpload}
          videoFile={state.videoFile}
          controllerRef={refs.controllerRef}
          setProgress={actions.setProgress}
          handleError={actions.handleError}
        />
      );
    }

    return (
      <UploadVideoSection
        videoFile={state.videoFile}
        handleTakeVideo={(file) =>
          actions.handleTakeVideo(file, setUploadTitle)
        }
        handleCancelTakenVideo={handleCancelTakeVideo}
        setUploading={actions.setIsUploading}
        handleTitle={handleUploadTitle}
        titleError={uploadTitleError}
        title={uploadTitle}
      />
    );
  }

  return (
    <div
      style={{ background: COLORS.background.radialGradient }}
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-4
        sm:px-6
        lg:px-8
        py-6
        font-display
      "
    >
       {state.errorMessage && (
            <CustumError
              apiError={state.errorMessage}
              clearError={actions.clearError}
            />
          )}
      <div className="w-full max-w-6xl">
        <MainText
          bigTitle={<FormattedMessage id="upload.page.title" />}
          smallTitle={<FormattedMessage id="upload.page.subtitle" />}
        />

        <div
          className="
            relative
            mt-6
            md:mt-8
            lg:mt-10
            bg-white/60
            rounded-xl
            backdrop-blur-sm
          "
        >
         

          <div
            className="
              w-full
              flex
              flex-col
              items-center
              px-4
              py-6
              sm:px-6
              sm:py-8
              md:px-8
              lg:px-10
            "
          >
            {!state.isUploading && (
              <SelectBox handleSelected={handleSelected} selected={selected} />
            )}

            {renderUploadContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
