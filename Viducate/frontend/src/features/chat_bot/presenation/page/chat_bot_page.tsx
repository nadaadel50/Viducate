import { useChat } from "../hooks/use_chat";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { useChatMessages } from "../hooks/use_chat_message";

import { ChatHeader } from "../widgets/chat_header";
import { ChatMessages } from "../widgets/chat_messages";
import { ChatInputBtn } from "../widgets/chat_input_btn";
import { RecentChatsSidebar } from "../widgets/recent_chat_sideBar";
import { useIntl } from "react-intl";
import { ConfirmationModal } from "../../../../core/componants/confirmation_modal";
import { useLanguage } from "../../../../core/hooks/useLanguage";

export function ChatBotPage() {
  const { closeChat, open } = useChat();
  const { videoTitle } = useLearningSession();
  const intl = useIntl();
  const { isRTL } = useLanguage();
  const {
    messages,
    handleSend,
    messagesEndRef,
    openRecentChats,
    handleOpenRecentChats,
    clearMessages,
    sessions,
    handleSelectNewSession,
    sessionId,
    openDeleteModal,
    handleOpenDeleteMessage,
    handleDeleteSession,
    isLoadingMessage,
    error,

    isDeleteSessionLoading,
    deleteSessionError,
  } = useChatMessages(open);

  const handleCloseDeleteModal = () => {
    handleOpenDeleteMessage(false);
  };

  const handleConfirmDelete = () => {
    handleDeleteSession();
    handleOpenDeleteMessage(false);
  };

  return (
    <div className="fixed inset-0 z-100 flex justify-end pointer-events-none">
      {/* Overlay */}
      <div
        onClick={closeChat}
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "opacity-0"
        }`}
      />

      {/* Chat Panel */}
      <div
        className={`relative flex h-full  max-w-full bg-white/90 shadow-xl transition-transform duration-300 ease-out w-[80%] md:w-[50%] ${
          open
            ? "translate-x-0 pointer-events-auto"
            : "translate-x-full pointer-events-none"
        }`}
      >
        {/* Recent Chats */}

        <div
          className={`absolute top-0 z-10 h-full transition-transform duration-300 ease-out
    ${isRTL ? "left-0" : "right-0"}
    ${
      openRecentChats
        ? "translate-x-0"
        : isRTL
          ? "-translate-x-full"
          : "translate-x-full"
    }`}
        >
          <RecentChatsSidebar
            selectedSession={sessionId}
            handleOpenSession={handleOpenRecentChats}
            handleClearMessages={clearMessages}
            sessions={sessions}
            handleSelectNewSession={handleSelectNewSession}
            setOpenDeleteMessage={handleOpenDeleteMessage}
          />
        </div>
        {/* Delete Modal */}
        {deleteSessionError && (
          <div className="absolute top-0 z-20 flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
            <span className="font-semibold">Error:</span> {deleteSessionError}
          </div>
        )}
        <ConfirmationModal
          open={openDeleteModal}
          isLoading={isDeleteSessionLoading}
          title=  {intl.formatMessage({ id: "chat.deleteModal.title" })}
          description={intl.formatMessage({ id: "chat.deleteModal.description" })}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />

        {/* Main Content */}
        <div
          onClick={openRecentChats ? handleOpenRecentChats : undefined}
          className="flex h-full w-full flex-col"
        >
          <ChatHeader
            handleOpenSession={handleOpenRecentChats}
            videoTitle={videoTitle ?? ""}
          />

          <ChatMessages
            messages={messages}
            messagesEndRef={messagesEndRef}
            isLoadingMessage={isLoadingMessage}
            error={error}
          />

          <ChatInputBtn handleSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
