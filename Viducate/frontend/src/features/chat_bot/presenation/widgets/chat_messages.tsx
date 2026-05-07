import { formatMessageTime } from "../../../../core/utils/fomat_time";
import type { Message } from "../../domain/entity/message";
import { AssistantMessage } from "./assistant_message";
import { UserMessage } from "./user_message";

type ChatMessagesListProps = {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};
export function ChatMessages(props: ChatMessagesListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
      <div className="flex flex-col min-h-full justify-end gap-3">
        {props.messages.map((message) =>
          message.role === "user" ? (
            <UserMessage
              key={message.id}
              message={message.content}
              senededTime={formatMessageTime(message.time)}
            />
          ) : (
            <AssistantMessage
              key={message.id}
              message={message.content}
              senededTime={"2"}
            />
          ),
        )}
      </div>
      <div ref={props.messagesEndRef} />
    </div>
  );
}
