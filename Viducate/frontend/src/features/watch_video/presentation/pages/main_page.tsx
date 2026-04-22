import { LeftContentSection } from "../sections/left_content_section";
import { RightContentSection } from "../sections/right_content_section";
import { useVideoData } from "../../../../core/hooks/useVideoData";
import { useSelectedTopic } from "../context/topic_context";
import { useEffect } from "react";
import Loading from "../../../../core/widgets/loading";
import { ErrorMessage } from "../../../../core/widgets/error";

export function MainPage() {
    
  
  let { data: topics, isLoading, error } = useVideoData();
  //lets say that data came from useVideoData is fake data right now


  
  const { selectedTopic, setSelectedTopic } = useSelectedTopic();
 

  useEffect(() => {
    if (topics && topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0]);
    }
  }, [topics]);



  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage errorMessage={error.message} />;
  } 

  return (
    <div className="flex font-display bg-[#f8fafc]">
      <div className="flex-1 border-r border-slate-200">
        <LeftContentSection />
      </div>

      <div className="flex-[3.5]">
        <RightContentSection />
      </div>
    </div>
  );
}
