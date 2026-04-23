import {
  CircleCheckBig,
  FileQuestion,
  FileText,
  TvMinimalPlay,
} from "lucide-react";
import { TopicEndCard } from "../widgets/topic_ended_card";
export function TopicEndSection() {
  return (
    <div className="bg-white  p-8 w-200 relative overflow-hidden flex flex-col justify-center items-center  rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
      {/* icon */}
      <span className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50">
        <CircleCheckBig size={48} className="text-green-700" />
      </span>

      {/* text */}
      <h1 className="text-[#111218] tracking-tight text-[32px]  font-bold leading-tight text-center mb-2">
        Topic Completed!
      </h1>
      <p className="text-[#636988] text-lg font-normal leading-normal text-center max-w-lg mb-8">
        Great job! You've mastered this section. Choose one of the activities
        below to reinforce your learning.
      </p>

      {/* cards */}
      <div className="w-full grid grid-cols-2  gap-4 ">
        <TopicEndCard
          icon={<FileText size={28} />}
          title={"Summary"}
          description={"Review the key points of this topic"}
          variant="blue"
     
        />
        <TopicEndCard
          icon={<FileQuestion size={28} />}
          variant="purple"
          title="Quiz"
          description="Test your understanding"
        />

        <TopicEndCard
          variant="teal"
          icon={<FileQuestion size={28} />}
          title="Flashcards"
          description="Practice recall"
        />
        <TopicEndCard
          icon={<TvMinimalPlay size={28} />}
          variant="orange"
          title={"Next Topic"}
          description={"Proceed to the next section"}
          
        />
      </div>
    </div>
  );
}
