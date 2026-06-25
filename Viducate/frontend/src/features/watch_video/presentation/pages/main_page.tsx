import { LeftContentSection } from "../sections/left_content_section";
import { RightContentSection } from "../sections/right_content_section";
import { useVideoData } from "../../../../core/hooks/useVideoData";

import { useEffect, useState } from "react";
import LoadingScreen from "../../../../core/componants/loading_screen";
import { ErrorScreen } from "../../../../core/componants/error";

import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { ChatProvider } from "../../../chat_bot/presenation/context/chatbot_provider";
import { useUnsavedChangesWarning } from "../hook/use_unsave_changes";
import { STORAGE_KEYS } from "../../../../core/constants";
import { CustomizeExperienceModal } from "../../../preferences/presentation/pages/CustomizeExperienceModal";
import { LanguageInitModal } from "../../../preferences/presentation/componants/LanguageInitModal";


export function MainPage() {
  const { videoId, hasUnsavedChanges,setCurrentTime } = useLearningSession();

  const { data: data, isLoading, error } = useVideoData();

  const [isInitOpen, setIsInitOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  useEffect(() => {
    if (!videoId) return;

    const key = `init_modal_seen_${videoId}`;
    const hasSeen = localStorage.getItem(key);

    if (!hasSeen) {
      setIsInitOpen(true);
      localStorage.setItem(key, "true");
    }
  }, [videoId]);

  const handleGoToCustomize = () => {
    setIsInitOpen(false);
    setTimeout(() => {
      setIsCustomizeOpen(true);
    }, 300);
  };

  useEffect(() => {
  return () => {
    console.log("MainPage unmounted");
    sessionStorage.removeItem(STORAGE_KEYS.currentTime);
    
  };
}, []);

// useEffect(()=>{
//   if(!data)return

//   console.log("came here to handle save when open")

//   handleSaveProgress()

  
// },[data])


  useUnsavedChangesWarning(hasUnsavedChanges);

  if (isLoading && !data) return <LoadingScreen smallText={"Get Ready"} bigText={"Your smart study session is Loading"} />;
  if (error) return <ErrorScreen errorMessage={error.message} />;
  else {
    return (
      <>
       
        <div className="flex font-display bg-[#f8fafc] ">
          <div className="flex-1 border-r border-slate-200 h-screen ">
            <LeftContentSection />
          </div>

          <div className="flex-[3.5]">
            <ChatProvider>
              <RightContentSection />
            </ChatProvider>
          </div>
        </div>
        <LanguageInitModal
          isOpen={isInitOpen}
          onClose={() => setIsInitOpen(false)}
          onCustomize={handleGoToCustomize}
        />

        <CustomizeExperienceModal
          isOpen={isCustomizeOpen}
          onClose={() => setIsCustomizeOpen(false)}
          videoId={videoId}
        />
      </>
    );
  }
}


