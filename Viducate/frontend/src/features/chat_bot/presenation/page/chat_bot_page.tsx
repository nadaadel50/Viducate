import { useChat } from "../hooks/use_chat";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { useChatMessages } from "../hooks/use_chat_message";

import { ChatHeader } from "../widgets/chat_header";
import { ChatMessages } from "../widgets/chat_messages";
import { ChatInputBtn } from "../widgets/chat_input_btn";
import { RecentChatsSidebar } from "../widgets/recent_chat_sideBar";
import { ConfirmationModal } from "../../../../core/componants/confirmation_modal";


export function ChatBotPage() {
  const { closeChat, open } = useChat();
  const { videoTitle } = useLearningSession();

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
  } = useChatMessages(open);

  const handleCloseDeleteModal = () => {
    handleOpenDeleteMessage(false);
  };

  const handleConfirmDelete = () => {
    handleDeleteSession();
    handleOpenDeleteMessage(false);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end pointer-events-none">
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
          className={`absolute top-0 right-0 z-10 h-full transition-transform duration-300 ease-out ${
            openRecentChats ? "translate-x-0" : "translate-x-full"
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
        <ConfirmationModal
          open={openDeleteModal}
          confirmVariant="danger"
          title="Delete Chat"
          description="Are you sure you want to delete this conversation? This action cannot be undone."
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
          />

          <ChatInputBtn handleSend={handleSend} />
        </div>
      </div>
    </div>
  );
}