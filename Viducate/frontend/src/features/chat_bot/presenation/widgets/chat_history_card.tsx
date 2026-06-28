import { History, Trash2 } from "lucide-react";

import { formatMessageTime } from "../../../../core/utils/fomat_time";
import { useIntl } from "react-intl";

import type { ChatSession } from "../../domain/entity/chat_session";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  TEXT_UTILS,
} from "../../../../core/constants/fonts_update";

type ChatHistoryCardProps = {
  session: ChatSession;
  handleSelectNewSession: (id: number) => void;
  setOpenDeleteMessage: (value: boolean) => void;
  selected: boolean;
};

export function ChatHistoryCard({
  session,
  handleSelectNewSession,
  setOpenDeleteMessage,
  selected,
}: ChatHistoryCardProps) {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenDeleteMessage(true);
  };
  const intl = useIntl();
  return (
    <div
      onClick={() => handleSelectNewSession(session.id)}
      className={`
        group flex w-full cursor-pointer items-start gap-2.5
        rounded-lg border px-3 py-2 transition-all duration-200
        ${
          selected
            ? "border-[#4f46e5]/20 bg-[#4f46e5]/10"
            : "border-transparent hover:bg-slate-100/80"
        }
      `}
    >
      {/* Icon */}
      <div
        className={`mt-0.5 shrink-0 ${
          selected ? "text-[#4f46e5]" : "text-slate-400"
        }`}
      >
        <History size={16} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h4
          className={`
            ${FONT_SIZE.size12}
            ${FONT_WEIGHT.medium}
            ${TEXT_UTILS.truncate}
            transition-colors
            ${selected ? "text-[#4f46e5]" : "text-slate-700"}
          `}
        >
          {session.title}
        </h4>

        <p
          className={`
            ${FONT_SIZE.size10}
            text-slate-400
            mt-0.5
          `}
        >
          {formatMessageTime(session.last_message_at)}
        </p>
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={handleDelete}
        aria-label={intl.formatMessage({
          id: "chat.history.delete",
        })}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-100 hover:text-red-500"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
