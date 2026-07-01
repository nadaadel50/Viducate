import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useScrollRestore } from "../../core/hooks/useScrollRestore";
import { IntWrapper } from "../../core/l10n/intWrapper";
import { AuthProvider } from "../../features/auth/presentation/context/auth_provider";
import { LearningSessionProvider } from "../../core/contexts/learning_content_context/learning_constent_provider";
import { ToastProvider } from "../../core/contexts/toast_message_context/toast_message_provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  useScrollRestore();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        
          <IntWrapper>
            <ToastProvider>
              <LearningSessionProvider>{children}</LearningSessionProvider>
            </ToastProvider>
          </IntWrapper>
        
      </AuthProvider>
    </QueryClientProvider>
  );
}