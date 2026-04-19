import {
  ArrowRight,
  CircleCheckBig,
  Clock4,
  FileQuestion,
  FolderUp,
  Save,
  Share2,
  FileText,
  Brain,
} from "lucide-react";
import { MediaBtn } from "../widgets/media_btn";
import { VideoPlayer } from "../widgets/video_part";
import { TranscriptSearch } from "../widgets/transcript_search";
import { FinalGeneratedBtn } from "../widgets/final_generated_btn";

export function RightContentSection() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* 🔹 HEADER ( */}
      <div className="px-6 pt-15 ">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Understanding Limit Laws
        </h1>

        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-1.5 items-center ">
            <Clock4  className="w-4 h-4 text-slate-500" />
            <p className="text-sm text-slate-500 ">45 min</p>
          </div>

          <div className="flex gap-2">
            <MediaBtn icon={<FolderUp size={18} />} label="Export" onClick={() => {}} />
            <MediaBtn icon={<Save size={18} />} label="Save" onClick={() => {}} />
            <MediaBtn icon={<Share2 size={18} />} label="Share" onClick={() => {}} />
          </div>
        </div>
      </div>

      {/* 🔹 CONTENT (centered) */}
      <div className="px-6 pb-10 flex-1 max-w-5xl mx-auto w-full">

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
          <button className=" cursor-pointer flex-1 flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:border-[#4f46e5]/50 hover:bg-slate-50 hover:text-[#4f46e5] transition">
            <CircleCheckBig size={20} />
            Complete Video
          </button>

          <button className="cursor-pointer flex-1 flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800 transition">
            Next Video
            <ArrowRight size={20} />
          </button>
        </div>

      </div>

      {/* 🔹 FOOTER */}
      <div className="border-t border-slate-200 bg-white/80 backdrop-blur p-4 sticky bottom-0 left-0 w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-3">
          <FinalGeneratedBtn variant="quiz" icon={<FileQuestion size={20} />} label="Final Quiz" onClick={() => {}} />
          <FinalGeneratedBtn variant="summary" icon={<FileText size={20} />} label="Final Summary" onClick={() => {}} />
          <FinalGeneratedBtn variant="flashcards" icon={<FileQuestion size={20} />} label="Final Flashcards" onClick={() => {}} />
          <FinalGeneratedBtn variant="mindmap" icon={<Brain size={20} />} label="Final Mind Map" onClick={() => {}} />
        </div>
      </div>

    </div>
  );
}
