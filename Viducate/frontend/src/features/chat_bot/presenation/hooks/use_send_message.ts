import { useMutation } from "@tanstack/react-query";
import { getAnswerCardUseCase } from "../../../../core/di/chat_bot_container";
import type { UserAsk } from "../../domain/entity/user_ask";


export function useSendMessage (){
  const mutation= useMutation({
    mutationFn: async (req: UserAsk) => {
      console.log("came heror to get the answer")
      const response =
        await getAnswerCardUseCase(req)

      if (!response.success) {
        throw new Error("get answer chatbot failed");
      }
      console.log("lets get answer")
      console.log(response.data)

      return response.data;
    },
  });

  return {
    sendMessage: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
};

// import { useMutation } from "@tanstack/react-query";
// import type { ChatResponse } from "../../domain/entity/chat_response";
// import type { UserAsk } from "../../domain/entity/user_ask";

// export function useSendMessage() {
//   const mutation = useMutation({
//     mutationFn: async (_req: UserAsk): Promise<ChatResponse> => {
//       // fake delay
//       await new Promise((resolve) =>
//         setTimeout(resolve, 1000)
//       );

//       // fake response
//       return {
//         session: {
//           id: 2,
//           title: "React Roadmap2",
//         },

//         message: {
//           answer:
//             "شطوووووووووووور",
//         },
//       };
//     },
//   });

//   return {
//     sendMessage: mutation.mutate,
//     isLoading: mutation.isPending,
//     error: mutation.error?.message ?? null,
//     reset: mutation.reset,
//   };
// }