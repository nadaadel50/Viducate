export type ChatResponse = {
  session: {
    id: number;
    title: string;
  };

  message: {
    message_id: string;
    content: string;
  };
};
