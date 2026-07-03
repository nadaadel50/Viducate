import type { ContinueLearningEntity } from "../../../domain/entity/continue_learning";
import { CardDetails } from "./card_details";
import { CardLayout } from "./card_laylout";
import { useNavigate } from "react-router";
import { useLearningSession } from "../../../../../core/hooks/useLearningContent";
import { AppRoutesNames } from "../../../../../app/routers/routes";
import { useQueryClient } from "@tanstack/react-query";

type ContinueLearningCardProps = {
  cardData: ContinueLearningEntity;
};

export function ContinueLearningCard({ cardData }: ContinueLearningCardProps) {
  const navigate = useNavigate();
  const { setVideoId } = useLearningSession();
  const queryClient = useQueryClient();

  const handleClick = async () => {
    await setVideoId(cardData.videoId);
    await queryClient.refetchQueries({
      queryKey: ["topics", cardData.videoId],
      exact: true,
    });
    navigate(AppRoutesNames.watchVideo);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-xl border border-slate-100 overflow-hidden 
        hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 
        cursor-pointer hover:-translate-y-1 transform"
    >
      <CardLayout cardData={cardData} />
      <CardDetails cardData={cardData} />
    </div>
  );
}
