import { PanelLeft, PanelRight, Plus } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { FONT_STYLES } from "../../../../core/constants/fonts";
import { CustomButton } from "../../../../core/componants/custum_btn";
import type { ChatSession } from "../../domain/entity/chat_session";
import { ChatHistoryCard } from "./chat_history_card";
import { useLanguage } from "../../../../core/hooks/useLanguage";
import { useChat } from "../hooks/use_chat";

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
  const { isRTL } = useLanguage();
  const { getSessionsError, IsgetSessionLoading } = useChat();

  return (
    <aside
      className={`flex h-full w-60 flex-col bg-white/10 px-2 backdrop-blur-xl lg:w-80
        ${isRTL ? "border-l" : "border-r"} border-slate-200`}
    >
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
          aria-label={intl.formatMessage({
            id: "chat.sidebar.close",
          })}
          className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-all duration-200 hover:bg-[#4f46e5] hover:text-white hover:shadow-md active:scale-95 lg:h-8 lg:w-8"
        >
          {isRTL ? (
            <PanelLeft
              size={20}
              className="transition-transform duration-200 group-hover:scale-110 lg:h-[18px] lg:w-[18px]"
            />
          ) : (
            <PanelRight
              size={20}
              className="transition-transform duration-200 group-hover:scale-110 lg:h-[18px] lg:w-[18px]"
            />
          )}
        </button>
      </div>

      {/* Chats */}

      <div className="custom-scrollbar flex-1 overflow-y-auto px-2 py-3">
        <p className={`${FONT_STYLES.overline} mb-3 px-2 text-slate-400`}>
          <FormattedMessage id="chat.sidebar.recentChats" />
        </p>

        {getSessionsError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
            <span className="font-semibold">Error:</span> {getSessionsError}
          </div>
        )}
        {IsgetSessionLoading && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700">
            <span className="font-semibold">Loading...</span>
          </div>
        )}

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
