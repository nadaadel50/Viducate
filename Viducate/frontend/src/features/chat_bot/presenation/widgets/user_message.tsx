import {
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../../../core/constants/fonts_update";
import { formatMessageTime } from "../../../../core/utils/fomat_time";
import { FormattedMessage } from "react-intl";
type UserMessageProps = {
  message: string;
  senededTime: number;
};

export function UserMessage({ message, senededTime }: UserMessageProps) {
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-[#4f46e5] px-4 py-3 text-white shadow-md shadow-[#4f46e5]/10 lg:max-w-[80%]">
        <p dir="auto" className={FONT_SIZE.size13}>
          {message}
        </p>
      </div>

      <div className="mr-1 flex items-center">
        <span
          className={`${FONT_SIZE.size10} ${FONT_WEIGHT.semibold} text-slate-400`}
        >
          <>
            <FormattedMessage id="chat.user.you" /> •{" "}
            {formatMessageTime(senededTime)}
          </>
        </span>
      </div>
    </div>
  );
}
