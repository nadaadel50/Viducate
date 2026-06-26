import { LeftContentSection } from "../sections/left_content_section";
import { RightContentSection } from "../sections/right_content_section";
import { useVideoData } from "../../../../core/hooks/useVideoData";

import { useEffect, useState } from "react";
import LoadingScreen from "../../../../core/componants/loading_screen";
import { ErrorScreen } from "../../../../core/componants/error";

import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { ChatProvider } from "../../../chat_bot/presenation/context/chatbot_provider";
import { useUnsavedChangesWarning } from "../hook/use_unsave_changes";
import { COLORS, STORAGE_KEYS } from "../../../../core/constants";
import { CustomizeExperienceModal } from "../../../preferences/presentation/pages/CustomizeExperienceModal";
import { LanguageInitModal } from "../../../preferences/presentation/componants/LanguageInitModal";

export function MainPage() {
  const { videoId, hasUnsavedChanges } = useLearningSession();

  const { data: data, isLoading, error } = useVideoData();

  const [isInitOpen, setIsInitOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      sessionStorage.removeItem(STORAGE_KEYS.currentTime);
    };
  }, []);

  useUnsavedChangesWarning(hasUnsavedChanges);

  if (isLoading && !data)
    return (
      <LoadingScreen
        smallText={"Get Ready"}
        bigText={"Your smart study session is Loading"}
      />
    );
  if (error) return <ErrorScreen errorMessage={error.message} />;
  else {
    return (
      <>
        <div 
        className="flex h-screen bg-[#f8fafc] font-display">
          {/* hiddend===display=none */}
          <aside className="hidden lg:block lg:w-[320px] border-r border-slate-200">
            <LeftContentSection />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <ChatProvider>
              <RightContentSection
                onOpenTopics={() => setIsSidebarOpen(true)}
              />
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

        <>
     
          <div
            onClick={() => setIsSidebarOpen(false)}
            className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
              isSidebarOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          />

     
          <aside
            className={`fixed left-0 top-0 z-50 h-full w-[90%] max-w-sm border-r border-slate-200 bg-white shadow-2xl transition-all duration-300 ease-out lg:hidden ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <LeftContentSection onClose={() => setIsSidebarOpen(false)} />
          </aside>
        </>
      </>
    );
  }
}
