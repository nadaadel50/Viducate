import { LeftContentSection } from "../sections/left_content_section";
import { RightContentSection } from "../sections/right_content_section";
import { useVideoData } from "../../../../core/hooks/useVideoData";

import { useEffect, useState } from "react";
import Loading from "../../../../core/widgets/loading";
import { ErrorMessage } from "../../../../core/widgets/error";
import { LanguageInitModal } from "../../../video_upload/presentation/componants/LanguageInitModal";
import { CustomizeExperienceModal } from "../../../video_upload/presentation/componants/CustomizeExperienceModal";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";

export function MainPage() {
  const { videoId, selectedTopic, setSelectedTopic  } = useLearningSession();

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

  useEffect(() => {
    if (data && data.topics.length > 0 && !selectedTopic) {
      setSelectedTopic(data.topics[0]);
     
      
    }
  }, [data?.topics, selectedTopic, setSelectedTopic]);

  const handleGoToCustomize = () => {
    setIsInitOpen(false);
    setTimeout(() => {
      setIsCustomizeOpen(true);
    }, 300);
  };

  if (isLoading && !data) return <Loading />;
  if (error) return <ErrorMessage errorMessage={error.message} />;

  return (
    <>
      <div className="flex font-display bg-[#f8fafc]">
        <div className="flex-1 border-r border-slate-200">
          <LeftContentSection />
        </div>

        <div className="flex-[3.5]">
          <RightContentSection />
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
