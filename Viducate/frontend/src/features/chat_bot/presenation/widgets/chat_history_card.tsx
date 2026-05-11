import { History, Trash2 } from "lucide-react";

import type { ChatSession } from "../../domain/entity/chat_session";

import { formatMessageTime } from "../../../../core/utils/fomat_time";

type ChatHistoryCardProps = {
  session: ChatSession;

  handleSelectNewSession: (id: number) => void;
  setOpenDeleteMessage: (value:boolean) => void;

  selected: boolean;
};

export function ChatHistoryCard(props: ChatHistoryCardProps) {
  function handleDelete() {
    props.setOpenDeleteMessage(true)

   
  }

  return (
    <button
      onClick={() => {
        props.handleSelectNewSession(props.session.id);
      }}
      className={`
        w-full
        flex
        items-start
        gap-3
        px-4
        py-3
        rounded-xl
        text-left
        transition-all
        duration-200
        cursor-pointer
        border
        group

        ${
          props.selected
            ? `
              bg-[#4f46e5]/10
              border-[#4f46e5]/20
            `
            : `
              bg-transparent
              border-transparent
              hover:bg-slate-100/80
            `
        }
      `}
    >
      <div
        className={`
          mt-0.5
          flex
          items-center
          justify-center
          shrink-0
          transition-colors

          ${props.selected ? "text-[#4f46e5]" : "text-slate-400"}
        `}
      >
        <History size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <h4
          className={`
            text-sm
            font-medium
            truncate
            transition-colors

            ${props.selected ? "text-[#4f46e5]" : "text-slate-700"}
          `}
        >
          {props.session.title}
        </h4>

        <p
          className="
            text-xs
            text-slate-400
            mt-1
          "
        >
          {formatMessageTime(props.session.last_message_at)}
        </p>
      </div>

      <button
        onClick={handleDelete}
        className="
          
          cursor-pointer
          transition-opacity
          p-1.5
          rounded-lg
          hover:bg-red-100
          text-slate-400
          hover:text-red-500
          shrink-0
        "
      >
        <Trash2 size={16} />
      </button>
      
    </button>
  );
}
