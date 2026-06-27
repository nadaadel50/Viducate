import { Bot } from "lucide-react";
import type { RefObject } from "react";

import type { ChatMessage } from "../../domain/entity/chat_message";
import { AssistantMessage } from "./assistant_message";
import { UserMessage } from "./user_message";

type ChatMessagesProps = {
  messages: ChatMessage[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
  isLoadingMessage: boolean;
};

export function ChatMessages({
  messages,
  messagesEndRef,
  isLoadingMessage,
}: ChatMessagesProps) {
  return (
    <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4">
      <div className="flex min-h-full flex-col justify-end gap-2.5">
        {messages.map((message) =>
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

        {isLoadingMessage && (
          <div className="flex items-end gap-2 ">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] text-white lg:h-8 lg:w-8">
              <Bot size={20} className="lg:h-[18px] lg:w-[18px]" />
            </span>

            <div className="flex items-center gap-1 rounded-2xl rounded-tl-none bg-white px-3 py-2 shadow-md shadow-[#4f46e5]/10">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#4f46e5]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#4f46e5] [animation-delay:0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#4f46e5] [animation-delay:0.3s]" />
            </div>
          </div>
        )}
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
}