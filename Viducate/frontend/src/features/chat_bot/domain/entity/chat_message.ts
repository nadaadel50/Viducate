export type ChatMessage = {
  message_id: string;
  role: "user" | "assistant";
  content: string;
  time?: number;
  created_at: string;
};
