// // features/chat/hooks/use_sessions.ts
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import {  getSessionsUseCase } from "../../../../core/di/chat_bot_container";
// import { useLearningSession } from "../../../../core/hooks/useLearningContent";
// import type { ChatSession } from "../../domain/entity/chat_session";


// export function useSessions() {
//   const queryClient = useQueryClient();
//   const {videoId}=useLearningSession()

//   const { data: sessions = [] } = useQuery({
//     queryKey: ["sessions",videoId],
//     queryFn: () => getSessionsUseCase(videoId!),
//     enabled:!!videoId
//   });

//   function addSession(session: ChatSession) {
//     queryClient.setQueryData(["sessions"], (old: ChatSession[]) => [
//       session,
//       ...old,
//     ]);
//   }

//   return { sessions, addSession };
// }


