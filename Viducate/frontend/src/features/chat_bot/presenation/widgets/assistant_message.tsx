import { Bot } from "lucide-react";
import { formatMessageTime } from "../../../../core/utils/fomat_time";
import {
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../../../core/constants/fonts_update";
import { useIntl } from "react-intl";
type AssistantMessageProps = {
  message: string;
  senededTime: number;
};

export function AssistantMessage({
  message,
  senededTime,
}: AssistantMessageProps) {
  const formattedMessage = message
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\* /g, "\n• ")
    .replace(/\. /g, ".\n\n");

  const intl = useIntl();
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-start gap-2">
        {/* AI Icon */}
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] text-white lg:h-8 lg:w-8">
          <Bot size={20} className="lg:h-[18px] lg:w-[18px]" />
        </span>

        {/* Message */}
        <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-white px-4 py-3 shadow-md shadow-[#4f46e5]/10 lg:max-w-[80%]">
          <p
            dir="auto"
            className={`${FONT_SIZE.size13} whitespace-pre-wrap break-words text-left`}
          >
            {formattedMessage}
          </p>
        </div>
      </div>

      {/* Time */}
      <div className="ml-11 lg:ml-10">
        <span
          className={`${FONT_SIZE.size10} ${FONT_WEIGHT.semibold} text-slate-400`}
        >
          {intl.formatMessage({
            id: "chat.assistant.name",
          })}{" "}
          • {formatMessageTime(senededTime)}
        </span>
      </div>
    </div>
  );
}
