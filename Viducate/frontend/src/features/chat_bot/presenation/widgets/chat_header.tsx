import { Bot, List, PanelRight, PanelRightOpen } from "lucide-react";
import { useState } from "react";

type ChatHeaderProps = {
  videoTitle: string;
  handleOpenSession:()=>void
};

export function ChatHeader(props: ChatHeaderProps) {

 // const{openRecenctChats,setOpenRecentChats}=useState<boolean>(false);


  return (
    <div className="flex items-center justify-between  bg-white/80 backdrop-blur-xl border-l border-white/20 w-full p-5 gap-6">
      <div className="flex gap-4">
        {/* icon */}
        <div>
          <span className="bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] h-10 w-10 rounded-xl flex items-center justify-center text-white">
            {" "}
            <Bot />
          </span>
        </div>

        {/* text */}
        <div className="flex flex-col ">
          <h3 className="text-xl font-bold text-slate-900 ">
            AI Learning Assistant
          </h3>

          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[11px] font-bold text-emerald-600  uppercase tracking-widest">
              {`Active • ${props.videoTitle ?? ""}`}
            </p>
          </div>
        </div>
      </div>

      <div>
        <button
        onClick={props.handleOpenSession}
          className=" group flex items-center justify-center h-10 w-10 rounded-xl   text-slate-500 transition-all duration-200 hover:bg-[#4f46e5] hover:text-white hover:shadow-lg active:scale-95 cursor-pointer"
        >
          <PanelRight 
            size={25}
            className="transition-transform duration-200 group-hover:scale-110"
          />
        </button>
      </div>
    </div>
  );
}
