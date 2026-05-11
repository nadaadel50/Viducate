// features/chat/hooks/use_sessions.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSessionsUseCase } from "../../../../core/di/chat_bot_container";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import type { ChatSession } from "../../domain/entity/chat_session";

export function useSessions() {
  const queryClient = useQueryClient();
  const { videoId } = useLearningSession();
 

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions", videoId],
    queryFn: async () => {
      const result = await getSessionsUseCase(videoId!);
      if (!result.success) {
        throw Error("Error With Sessions");
      }
     
      return result.data;
    },
    enabled: !!videoId,
  });

 function addSession(session: ChatSession) {
  queryClient.setQueryData(
    ["sessions", videoId],
    (old: unknown) => {
      const existing: ChatSession[] = Array.isArray(old) ? old : [];
    
      const filtered = existing.filter((s) => s.id !== session.id);
      return [session, ...filtered];
    }
  );
}

  return { sessions, addSession };
}
