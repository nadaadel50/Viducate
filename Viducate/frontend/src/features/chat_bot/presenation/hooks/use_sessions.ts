import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getSessionsUseCase } from "../../../../core/di/chat_bot_container";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import type { ChatSession } from "../../domain/entity/chat_session";
import { useChat } from "./use_chat";

export function useSessions() {
  const queryClient = useQueryClient();
  const { videoId } = useLearningSession();
  const { setErrorSessionSetter, setIsSessionLoadingSetter } = useChat();

  const {
    data: sessions = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["sessions", videoId],
    queryFn: async () => {
      const result = await getSessionsUseCase(videoId!);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!videoId,
  });

  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : "Something went wrong"
    : "";

  useEffect(() => {
    setIsSessionLoadingSetter(isLoading);
  }, [isLoading, setIsSessionLoadingSetter]);

  useEffect(() => {
    setErrorSessionSetter(errorMessage);
  }, [errorMessage, setErrorSessionSetter]);

  function addSession(session: ChatSession) {
    queryClient.setQueryData(["sessions", videoId], (old: unknown) => {
      const existing: ChatSession[] = Array.isArray(old) ? old : [];
      const filtered = existing.filter((s) => s.id !== session.id);
      return [session, ...filtered];
    });
  }

  async function refreshSessions() {
    await queryClient.invalidateQueries({
      queryKey: ["sessions", videoId],
    });
  }

  return {
    sessions,
    isLoadingSessions: isLoading,
    errorSessions: errorMessage,
    refetchSessions: refetch,
    addSession,
    refreshSessions,
  };
}
