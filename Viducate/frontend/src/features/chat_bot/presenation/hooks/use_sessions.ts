// // features/chat/hooks/use_sessions.ts
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { getSessionMessagesUseCase } from "../../../../core/di/chat_bot_container";
// import type { AllSessionMessagesRequest } from "../../domain/entity/all_chat_messages_req";

// export function useSessions(req:AllSessionMessagesRequest) {
//   const queryClient = useQueryClient();

//   const { data: sessions = [] } = useQuery({
//     queryKey: ["sessions"],
//     queryFn: () => getAll(req), // 👈 get all sessions مش messages
//   });

//   function addSession(session: ChatSession) {
//     queryClient.setQueryData(["sessions"], (old: ChatSession[]) => [
//       session,
//       ...old,
//     ]);
//   }

//   return { sessions, addSession };
// }


