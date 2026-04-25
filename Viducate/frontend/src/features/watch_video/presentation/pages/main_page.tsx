import { LeftContentSection } from "../sections/left_content_section";
import { RightContentSection } from "../sections/right_content_section";
import { useVideoData } from "../../../../core/hooks/useVideoData";
import { useSelectedTopic } from "../context/topic_context";
import { useEffect, useState } from "react";
import Loading from "../../../../core/widgets/loading";
import { ErrorMessage } from "../../../../core/widgets/error";
import { LanguageInitModal } from "../../../video_upload/presentation/componants/LanguageInitModal";
import { CustomizeExperienceModal } from "../../../video_upload/presentation/componants/CustomizeExperienceModal";

export function MainPage() {


  const { data: topics, isLoading, error } = useVideoData();
  //lets say that data came from useVideoData is fake data right now


  
  const { selectedTopic, setSelectedTopic } = useSelectedTopic();
 const videoId = selectedTopic?.video_id;
  
  const [isInitOpen, setIsInitOpen] = useState(true);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  

  
  useEffect(() => {
    if (topics && topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0]);
    }
  }, [topics, selectedTopic, setSelectedTopic]);


  const handleGoToCustomize = () => {
    setIsInitOpen(false);
    setTimeout(() => {
      setIsCustomizeOpen(true);
    }, 300);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage errorMessage={error.message} />;
  } 

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
