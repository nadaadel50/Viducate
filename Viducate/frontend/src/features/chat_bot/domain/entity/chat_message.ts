export type ChatMessage = {
  message_id: number;
  role: "user" | "assistant";
  content: string;
  time: number;
  created_at: string;
};