import { LinkSection } from "./link_section";
import { InputSection } from "../componants/input_section";
import { UploadBtn } from "../componants/upload_btn";
import { useLinkHandlers } from "../hooks/use_link_handler";
import { useLinkTitleInput } from "../hooks/use_link_input_handler";
import { uploadURLUseCase } from "../../../../core/di/upload_video_container";
import { UrlRequest } from "../../domain/entity/url_request";
import { useNavigate } from "react-router";
import { AppRoutesNames } from "../../../../app/routers/routes";
import  { useVideoId } from "../../../../core/hooks/useVideoId";


type UploadLinkSectionProps={
  handleError: (errorMessage: string) => void;
}

export function UploadLinkSection({handleError}:UploadLinkSectionProps) {
  const { setVideoId  } = useVideoId();
  
  const { url, handleUrlChange, linkError, handlePaste } = useLinkHandlers();
  const {
  linkTitle,
  linkTitleError,
  handleLinkTitle,

} = useLinkTitleInput();

const navigate=useNavigate();

 const handleUploadURL = async () => {
    if (!url) return;
    console.log(url)

    const response=await uploadURLUseCase.uploadUrl(new UrlRequest(
      url,linkTitle,"en","technology"
    ))

    if(response.success){
      console.log(response.data)
      navigate(`${AppRoutesNames.ProcessingPage}/${response.data.videoId}`);

      //add hook vedioId
      setVideoId (response.data.videoId); 
      

    }
    else{
     handleError(response.error)
    }

  
    
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
      />
    </>
  );
}