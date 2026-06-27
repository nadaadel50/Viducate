import { PanelRight, Plus } from "lucide-react";

import { FONT_STYLES } from "../../../../core/constants/fonts";
import type { ChatSession } from "../../domain/entity/chat_session";
import { ChatHistoryCard } from "./chat_history_card";
import { CustomButton } from "../../../../core/componants/custum_btn";
import { FormattedMessage, useIntl  } from "react-intl";

type RecentChatsSidebarProps = {
  handleOpenSession: () => void;
  handleClearMessages: () => void;
  sessions: ChatSession[];
  handleSelectNewSession: (id: number) => void;
  selectedSession: number | null;
  setOpenDeleteMessage: (value: boolean) => void;
};

export function RecentChatsSidebar({
  handleOpenSession,
  handleClearMessages,
  sessions,
  handleSelectNewSession,
  selectedSession,
  setOpenDeleteMessage,
}: RecentChatsSidebarProps) {
  const intl = useIntl();
  return (
    <aside className="flex h-full w-60 flex-col border-r border-slate-200 bg-white/10 px-2 backdrop-blur-xl lg:w-80">
      {/* Header */}
      <div className="flex gap-3 border-b border-slate-100 p-3 lg:p-4">
        <CustomButton
          type="button"
          onClick={() => {
            handleClearMessages();
            handleOpenSession();
          }}
          className={`${FONT_STYLES.button} flex w-full items-center justify-center gap-2 rounded-lg bg-[#4f46e5] py-2.5 text-white transition-all hover:bg-[#4338ca] active:scale-95`}
        >
          <Plus size={16} />
          <FormattedMessage id="chat.sidebar.newChat" />
        </CustomButton>

        <button
          type="button"
          onClick={handleOpenSession}
          className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-all duration-200 hover:bg-[#4f46e5] hover:text-white hover:shadow-md active:scale-95 lg:h-8 lg:w-8"
        >
          <PanelRight
          aria-label={intl.formatMessage({
  id: "chat.sidebar.close",
})}
            size={20}
            className="transition-transform duration-200 group-hover:scale-110 lg:h-[18px] lg:w-[18px]"
          />
        </button>
      </div>

      {/* Chats */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-2 py-3">
        <p className={`${FONT_STYLES.overline} mb-3 px-2 text-slate-400`}>
          <FormattedMessage id="chat.sidebar.recentChats" />
        </p>

        <div className="space-y-2">
          {sessions.map((session) => (
            <ChatHistoryCard
              key={session.id}
              session={session}
              selected={selectedSession === session.id}
              handleSelectNewSession={handleSelectNewSession}
              setOpenDeleteMessage={setOpenDeleteMessage}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}