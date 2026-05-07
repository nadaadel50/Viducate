import { SendHorizontal } from "lucide-react";

type ChatInputProps = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => void;
};



export function ChatInputBtn(props:ChatInputProps){
    
    return(
         <div className="m-5 relative shrink-0 ">
            <input
              value={props.input}
              onChange={(e) => props.setInput(e.target.value)}
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  props.handleSend();
                }
              }}
              placeholder="ask any thing about the lecture"
              className="relative w-full border  shadow-lg  bg-white  border-slate-200  rounded-[2rem] py-6 pl-8 pr-16 text-base focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all shadow-xl-soft"
            />

            <div className="absolute right-4 top-1/2 -translate-y-1/2  ">
              <button
                onClick={props.handleSend}
                className="p-3 flex items-center justify-center rounded-2xl bg-[#4f46e5]/90 text-white hover:bg-[#4f46e5] transition-all shadow-lg shadow-[#4f46e5]/25 active:scale-95 cursor-pointer"
              >
                <SendHorizontal />
              </button>
            </div>
          </div>
    )
}