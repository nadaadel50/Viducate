import { Bot } from "lucide-react";
import { formatMessageTime } from "../../../../core/utils/fomat_time";

type AssistantMessageProps = {
  message: string;
  senededTime: number;
};

export function AssistantMessage(
  props: AssistantMessageProps,
) {
  const formattedMessage =
    props.message
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\* /g, "\n• ")
      .replace(/\. /g, ".\n\n");

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] text-white">
          <Bot />
        </span>
        

        <div className="max-w-[80%] rounded-3xl rounded-tl-none bg-white px-6 py-4 shadow-lg shadow-[#4f46e5]/10">

          <p className="break-words whitespace-pre-wrap text-left text-sm leading-relaxed" dir="auto">
            {formattedMessage}
          </p>
        </div>
      </div>

      <div className="mr-1 flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {`Viducate ai assistant • ${formatMessageTime(props.senededTime)}`}
        </span>
      </div>
    </div>
  );
}