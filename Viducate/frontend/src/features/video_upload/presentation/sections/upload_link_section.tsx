import { LinkSection } from "./link_section";
import { InputSection } from "../componants/upload/input_section";
import { UploadBtn } from "../componants/upload/upload_btn";
import { useLinkHandlers } from "../hooks/use_link_handler";
import { useLinkTitleInput } from "../hooks/use_link_input_handler";

import { useNavigate } from "react-router";
import { AppRoutesNames } from "../../../../app/routers/routes";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { useState } from "react";
import { useUploadLink } from "../hooks/upload_url";
import { ConfirmationModal } from "../../../../core/componants/confirmation_modal";
import { FolderOpen } from "lucide-react";
import { useIntl } from "react-intl";


export function UploadLinkSection() {
  const { setVideoId } = useLearningSession();
const intl = useIntl();
  const { url, handleUrlChange, linkError, handlePaste } = useLinkHandlers();
  const [showExistingVideoModal, setShowExistingVideoModal] = useState(false);

  const { linkTitle, linkTitleError, handleLinkTitle } = useLinkTitleInput();
  const { uploadLinkAsync, isLoading, error } = useUploadLink();

  const navigate = useNavigate();

  const handleUploadURL = async () => {
    if (!url) return;
  

    const data = await uploadLinkAsync({
      url,
      title: linkTitle,
      language: "en",
      subject: "technology",
    });

    setVideoId(data.videoId);

    if (data.message === "You already processed this video") {
      setShowExistingVideoModal(true);
      return;
    }
  
   sessionStorage.setItem('from_upload', 'true');

    navigate(AppRoutesNames.processing, {
      replace: true,
    });
  };

  return (
    <>
      <LinkSection
        url={url}
        error={linkError}
        handleUrlChange={handleUrlChange}
        handlePaste={handlePaste}
      />

      <InputSection
        title={linkTitle}
        error={linkTitleError}
        handleTitle={handleLinkTitle}
      />

      <UploadBtn
        disabled={linkError || url === "" || linkTitle === ""}
        label={intl.formatMessage({ id: "upload.link.uploadButton" })}
        onClick={handleUploadURL}
        isLoading={isLoading}
        error={error}
      />

     

      <ConfirmationModal
        open={showExistingVideoModal}
        title="Video Already Exists"
        description="This video has already been processed. Would you like to open it instead of uploading it again?"
        confirmText="Open Video"
        cancelText="Cancel"
        confirmVariant="primary"
        icon={<FolderOpen size={22} />}
        onClose={() => setShowExistingVideoModal(false)}
        onConfirm={() => {
          setShowExistingVideoModal(false);
          navigate(AppRoutesNames.watchVideo, { replace: true });
        }}
      />

     
    </>
  );
}
