import { History, PanelRight, Plus } from "lucide-react";
type RecentChatsSidebarProps={
  handleOpenSession:()=>void
}

export function RecentChatsSidebar(props:RecentChatsSidebarProps) {
  return (
    <div className="w-90 h-full border-r border-slate-200 bg-white/10 backdrop-blur-xl flex flex-col px-2 py-5 ">
      {/* header */}
      <div className="p-4 border-b border-slate-100 flex gap-5">
      
        <button
          className="
            w-full flex items-center justify-center gap-2
            bg-[#4f46e5]
            text-white
            rounded-xl
            py-3
            text-sm
            font-semibold
            hover:bg-[#4338ca]
            transition-all
          "
        >
          <Plus size={18} />
          New Chat
        </button>


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

      {/* chats */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className="text-xs font-semibold text-slate-400 mb-3 px-2">
          Recent Chats
        </p>

        <div className="space-y-2">
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
                Limit Laws Explained
              </h4>

              <p className="text-xs text-slate-400 mt-1">Just now</p>
            </div>
          </button>

          <button
            className="
              w-full flex items-start gap-3
              p-3 rounded-xl
              hover:bg-slate-100
              transition-all
              text-left
            "
          >
            <History size={18} className="text-slate-400 mt-0.5" />

            <div>
              <h4 className="text-sm font-medium text-slate-700">
                Practice Questions
              </h4>

              <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
