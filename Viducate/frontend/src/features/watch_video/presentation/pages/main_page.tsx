import { useEffect, useState } from "react";
import { LeftContentSection } from "../sections/left_content_section";
import { RightContentSection } from "../sections/right_content_section";
import { getTopicsUseCase } from "../../../../core/di/watch_video_container";
import type { TopicResponse } from "../../domin/entity/topic_response";

export function MainPage() {
  const [data, setData] = useState<TopicResponse[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
     const reponse = await getTopicsUseCase.getTopics({ videoId: 1 });
     if(reponse.success){
      setData(reponse.data);
      console.log("Fetched topics:", reponse.data);
      setLoading(false);
     } else {
      console.error("Failed to fetch topics:", reponse.error);
      setLoading(false);

     }
    }

    fetchData();
  }, []);

  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex font-display bg-[#f8fafc]">
      <div className="flex-1 border-r border-slate-200">
        <LeftContentSection  />
      </div>

      <div className="flex-[3.5]">
        <RightContentSection />
      </div>
    </div>
  );
}