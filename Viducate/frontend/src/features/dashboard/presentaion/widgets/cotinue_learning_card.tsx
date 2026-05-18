import { CardDetails } from "./card_details";
import { CardLayout } from "./card_laylout";

export function ContinueLearningCard() {
  return (
    <div className="group bg-white  rounded-2xl border border-slate-100  overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
      <CardLayout />

      <CardDetails />
    </div>
  );
}
