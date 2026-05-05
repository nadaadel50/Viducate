import { Bot, SendHorizontal } from "lucide-react";
import { COLORS } from "../../../../core/constants";
import { useChat } from "../hooks/use_chat";

export function ChatBotPage() {
  const { closeChat, open } = useChat();
  return (
    <div className="fixed inset-0 z-40 flex justify-end pointer-events-none ">
      {/* {black bg} */}
      <div
        onClick={closeChat}
        className={`
      absolute inset-0 bg-black/20 backdrop-blur-sm
      transition-opacity duration-300
      ${open ? "opacity-100 pointer-events-auto" : "opacity-0"}
    `}
      />

      <div
        className={`
      relative w-1/2 h-full bg-white/90 shadow-xl
      transform transition-transform duration-300 ease-out
      ${open ? "translate-x-0 pointer-events-auto" : "translate-x-full"}
    `}
      >
        {/* my contnet */}

        <div className="flex flex-col h-full">
          {/* messages */}
          <div className="flex flex-1 flex-col justify-end  p-8 custom-scrollbar gap-3">
            <div className="flex flex-col items-end gap-3">
              <div className="bg-[#4f46e5] text-white rounded-3xl rounded-tr-none px-6 py-4 max-w-[80%] shadow-lg shadow-[#4f46e5]/10">
                <p className="text-sm leading-relaxed">
                  Can you explain the Limit Laws mentioned at 12:45 in the
                  video? I'm specifically confused about when they apply.
                </p>
              </div>
              <div className="flex items-center gap-2 mr-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  You • 2 mins ago
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3">
              <div className="flex gap-2">
              <span className="bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] h-10 w-10 rounded-xl flex items-center justify-center text-white"> <Bot /></span>

                <div className="bg-white  rounded-3xl rounded-tl-none px-6 py-4 max-w-[80%] shadow-lg shadow-[#4f46e5]/10">
                  <p className="text-sm leading-relaxed">
                    Can you explain the Limit Laws mentioned at 12:45 in the
                    video? I'm specifically confused about when they apply.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mr-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Viducate ai assistant • 2 mins ago
                </span>
              </div>
            </div>
          </div>

          {/* input btn */}
          <div className="m-5 relative">
            <input
              type="text"
              placeholder="ask any thing about the lecture"
              className="relative w-full border  shadow-lg  bg-white  border-slate-200  rounded-[2rem] py-6 pl-8 pr-16 text-base focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all shadow-xl-soft"
            />

            <div className="absolute right-4 top-1/2 -translate-y-1/2  ">
              <button className="p-3 flex items-center justify-center rounded-2xl bg-[#4f46e5]/90 text-white hover:bg-[#4f46e5] transition-all shadow-lg shadow-[#4f46e5]/25 active:scale-95 cursor-pointer">
                <SendHorizontal />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
