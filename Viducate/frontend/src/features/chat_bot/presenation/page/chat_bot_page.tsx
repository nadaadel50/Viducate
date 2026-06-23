import { useChat } from "../hooks/use_chat";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { ChatHeader } from "../widgets/chat_header";
import { ChatMessages } from "../widgets/chat_messages";
import { ChatInputBtn } from "../widgets/chat_input_btn";
import { useChatMessages } from "../hooks/use_chat_message";
import { RecentChatsSidebar } from "../widgets/recent_chat_sideBar";
import { DeleteModal } from "../../../../core/componants/delete_modal";

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




  return (
    <div className="fixed inset-0 z-40 flex justify-end pointer-events-none ">
      {/* {black bg} */}
      <div
        onClick={closeChat}
        className={`
      absolute inset-0 bg-black/20 backdrop-blur-sm
      transition-opacity duration-300
      ${open ? "opacity-100 pointer-events-auto" : "opacity-0"}
    `}
      />

      <div
        className={`
      relative w-1/2 h-full bg-white/90 shadow-xl flex
      transform transition-transform duration-300 ease-out
      ${open ? "translate-x-0 pointer-events-auto" : "translate-x-full"}
    `}
      >
        <div
          className={`
      absolute top-0  right-0 h-full z-10 
      transform transition-transform duration-300 ease-out
      ${openRecentChats ? "translate-x-0" : "translate-x-full"}
    `}
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

       

        <DeleteModal
          open={openDeleteModal}
          title="Delete Chat"
          description="Are you sure you want to delete this conversation? This action cannot be undone."
          onClose={() => handleOpenDeleteMessage(false)}
          onConfirm={()=>{
             handleDeleteSession()
            handleOpenDeleteMessage(false);
          }}
        />

        {/* my contnet */}

        <div
          onClick={openRecentChats ? handleOpenRecentChats : undefined}
          className="flex flex-col h-full w-full"
        >
          {/* header */}
          <ChatHeader
            handleOpenSession={handleOpenRecentChats}
            videoTitle={videoTitle ?? ""}
          />

          {/* messages */}

          <ChatMessages
            messages={messages}
            messagesEndRef={messagesEndRef}
            isLoadingMessage={isLoadingMessage}
          />

          {/* input btn */}
          <ChatInputBtn handleSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
