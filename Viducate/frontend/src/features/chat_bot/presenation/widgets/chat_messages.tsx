import { Bot } from "lucide-react";
import type { ChatMessage } from "../../domain/entity/chat_message";
import { AssistantMessage } from "./assistant_message";
import { UserMessage } from "./user_message";

type ChatMessagesListProps = {
  messages: ChatMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isLoadingMessage: boolean;
};
export function ChatMessages(props: ChatMessagesListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
      <div className="flex flex-col min-h-full justify-end gap-3">
        {props.messages.map((message) =>
          message.role === "user" ? (
            <UserMessage
              key={message.message_id}
              message={message.content}
              senededTime={Date.now()}
            />
          ) : (
            <AssistantMessage
              key={message.message_id}
              message={message.content}
              senededTime={Date.now()}
            />
          ),
        )}

        {props.isLoadingMessage && (
          <div className="flex justify-start gap-2">
             <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] text-white">
          <Bot />
        </span>
        
            
            <div className="flex items-center gap-1 rounded-3xl rounded-tl-none bg-white px-5 py-4 shadow-lg shadow-[#4f46e5]/10">
              <span className="h-2 w-2 rounded-full bg-[#4f46e5] animate-bounce" />

              <span className="h-2 w-2 rounded-full bg-[#4f46e5] animate-bounce [animation-delay:0.15s]" />

              <span className="h-2 w-2 rounded-full bg-[#4f46e5] animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        )}
      </div>
      <div ref={props.messagesEndRef} />
    </div>
  );
}
