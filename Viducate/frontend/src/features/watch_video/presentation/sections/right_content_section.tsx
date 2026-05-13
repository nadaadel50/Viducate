import {
  ArrowRight,
  CircleCheckBig,
  FileQuestion,
  FileText,
  Brain,
  MessageCircle,
} from "lucide-react";
import { VideoPlayer } from "./video_part";
import { TranscriptSearch } from "../widgets/transcript_search";
import { FinalGeneratedBtn } from "../widgets/final_generated_btn";
import { MainHeader } from "../widgets/main_header";
import { ChatBotOpenBtn } from "../../../chat_bot/presenation/widgets/chat_bot_open_btn";
import { useNavigate } from "react-router";
import { AppRoutesNames } from "../../../../app/routers/routes";


export function RightContentSection() {
  const navigate=useNavigate()
  
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      {/* centered container */}
      <div className="w-full max-w-5xl px-8 ">
        {/* 🔹 HEADER (aligned with content start) */}
        <MainHeader />

        {/* 🔹 CONTENT */}
        <div className="flex-1 pb-10">
          {/* video */}
          <div className="mt-6">
            <VideoPlayer />
          </div>

          {/* search */}
          <div className="mt-8">
            <TranscriptSearch />
          </div>

          {/* actions */}
          <div className="mt-8 flex gap-3">
            <button className="cursor-pointer flex-1 flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:border-[#4f46e5]/50 hover:bg-slate-50 hover:text-[#4f46e5] transition">
              <CircleCheckBig size={20} />
              Complete Topic
            </button>

            <button className="cursor-pointer flex-1 flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800 transition">
              Next Topic
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* 🔹 FOOTER */}
      </div>
      <div className="w-full border-t border-slate-200 bg-white/80 backdrop-blur p-4 sticky bottom-0 ">
        <div className="grid grid-cols-2 gap-3">
          <FinalGeneratedBtn
            variant="quiz"
            icon={<FileQuestion size={20} />}
            label="Final Quiz"
            onClick={() => {}}
          />
          <FinalGeneratedBtn
            variant="summary"
            icon={<FileText size={20} />}
            label="Final Summary"
            onClick={() => {}}
          />
          <FinalGeneratedBtn
            variant="flashcards"
            icon={<FileQuestion size={20} />}
            label="Final Flashcards"
            onClick={() => {}}
          />
          <FinalGeneratedBtn
            variant="mindmap"
            icon={<Brain size={20} />}
            label="Final Mind Map"
            onClick={() => {
              navigate(AppRoutesNames.mindMap)
              
            }}
          />
        </div>
      </div>
      <ChatBotOpenBtn/>

     
    </div>
  );
}