export type ChatResponse = {
  session: {
    id: number;
    title: string;
  };

  message: {
    answer: string;
  };

};
