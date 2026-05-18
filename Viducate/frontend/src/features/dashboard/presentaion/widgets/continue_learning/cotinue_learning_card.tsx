import type { ContinueLearningEntity } from "../../../domain/entity/continue_learning";
import { CardDetails } from "./card_details";
import { CardLayout } from "./card_laylout";


type ContinueLearningCardProps = {
  cardData:ContinueLearningEntity
}

export function ContinueLearningCard({ cardData }: ContinueLearningCardProps) {
  return (
    <div className="group bg-white  rounded-xl border border-slate-100  overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
      <CardLayout cardData={cardData} />

      <CardDetails cardData={cardData} />
    </div>
  );
}
