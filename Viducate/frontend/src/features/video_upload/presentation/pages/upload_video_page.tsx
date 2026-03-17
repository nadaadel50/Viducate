import { UploadTitle } from "../componants/uplaod_title";
import { SelectBox } from "../componants/select_box";

import { useSelectBtnHandlers } from "../hooks/use_select_btn_handlers";

import { useRef, useState } from "react";

import { useUploadTitleInput } from "../hooks/use_upload_input_handler";
import { UploadLinkSection } from "../sections/upload_link_section";
import { UploadLoadingSection } from "../sections/upload_loading_section";
import { UploadVideoSection } from "../sections/upload_video_section";
import { CustumError } from "../../../../core/componants/custum_error";
export function UploadVideoPage() {
  const { handleSelected, selected } = useSelectBtnHandlers();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [error,setError]=useState<boolean>(false)
  const [errorMessage,setErrorMessage]=useState<string>("")
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

    function handleError(errorMessage:string){
      setError(true)
      setErrorMessage(errorMessage)

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
        controllerRef={controllerRef}
        handleError={handleError}
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

        <div className=" relative flex  justify-center items-center mt-10 bg-white rounded-xl">
          {/* appear error here */}
           {error&& <CustumError apiError={errorMessage} clearError={()=>{
            setError(false)
          } }/>}
         
          <div className="m-15 w-full flex flex-col items-center">
            
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
