import { LeftContentSection } from "../sections/left_content_section";
import { RightContentSection } from "../sections/right_content_section";
import { useVideoData } from "../../../../core/hooks/useVideoData";
import { useSelectedTopic } from "../context/topic_context";
import { useEffect, useState } from "react";
import { TopicResponse } from "../../domin/entity/topic_response";
import Loading from "../../../../core/widgets/loading";
import { ErrorMessage } from "../../../../core/widgets/error";

export function MainPage() {
   const fakeTopics: TopicResponse[] = [
    new TopicResponse(
      1,
      3,
      1,
      0,
      60,
      "Introduction",
      "What is AI?"
    ),
    new TopicResponse(
      2,
      3,
      2,
      61,
      120,
      "Basics",
      "Machine Learning Basics"
    ),
    new TopicResponse(
      3,
      3,
      3,
      121,
      500,
      "Deep Learning",
      "Neural Networks Intro"
    ),
    new TopicResponse(
      4,
      3,
      4,
      501,
      360,
      "Applications",
      "AI in Real Life"
    ),
  ];
  
  let { data: topics, isLoading, error } = useVideoData(3);
  const { selectedTopic, setSelectedTopic } = useSelectedTopic();
 
  
  // will remove this after api integration
  if(topics?.length===0){
    topics=fakeTopics;

  }
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
