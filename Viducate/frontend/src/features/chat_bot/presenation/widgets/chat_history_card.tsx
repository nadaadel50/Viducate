import { History } from "lucide-react";

type ChatHistoryCardProps={
    title:string
}


export function ChatHistoryCard(props:ChatHistoryCardProps){
    return(
         <button
            className="
              w-full flex items-start gap-3
              p-3 rounded-xl
              bg-[#4f46e5]/10
              text-left
            "
          >
            <History size={18} className="text-[#4f46e5] mt-0.5" />

            <div>
              <h4 className="text-sm font-semibold text-[#4f46e5]">
                {props.title}
              </h4>

              <p className="text-xs text-slate-400 mt-1">Just now</p>
            </div>
          </button>
    )
}