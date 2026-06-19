import { LinkSection } from "./link_section";
import { InputSection } from "../componants/input_section";
import { UploadBtn } from "../componants/upload_btn";
import { useLinkHandlers } from "../hooks/use_link_handler";
import { useLinkTitleInput } from "../hooks/use_link_input_handler";
import { uploadURLUseCase } from "../../../../core/di/upload_video_container";
import { UrlRequest } from "../../domain/entity/url_request";
import { useNavigate } from "react-router";
import { AppRoutesNames } from "../../../../app/routers/routes";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { useState } from "react";
import { ExistingVideoModal } from "../componants/exist_message";
import { useUploadLink } from "../hooks/upload_url";



export function UploadLinkSection() {
  const { setVideoId } = useLearningSession();

  const { url, handleUrlChange, linkError, handlePaste } = useLinkHandlers();
  const [showExistingVideoModal, setShowExistingVideoModal] = useState(false);

  const { linkTitle, linkTitleError, handleLinkTitle } = useLinkTitleInput();
  const {uploadLinkAsync,isLoading,error}=useUploadLink()

  const navigate = useNavigate();

  const handleUploadURL = async () => {
    if (!url) return;
    // console.log(url)

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

    navigate(AppRoutesNames.ProcessingPage, {
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
        label={"Upload link"}
        onClick={handleUploadURL}
        isLoading={isLoading}
        error={error}
      />

      <ExistingVideoModal
        show={showExistingVideoModal}
        onCancel={() => setShowExistingVideoModal(false)}
        onOpenVideo={async() => {
         

          navigate(AppRoutesNames.wathcVideo, { replace: true });
        }}
      />
    </>
  );
}
