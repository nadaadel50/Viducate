import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

import { LanguageProvider } from "../../core/contexts/languageContext/languageProvider";
import { useScrollRestore } from "../../core/hooks/useScrollRestore";
import { IntWrapper } from "../../core/l10n/intWrapper";
import { AuthProvider } from "../../features/auth/presentation/context/auth_provider";
import { LearningSessionProvider } from "../../core/contexts/learning_content_context/learning_constent_provider";
import { ToastProvider } from "../../core/contexts/toast_message_context/toast_message_provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  serialize: (data) => {
    console.log("💾 Saving to localStorage");
    return JSON.stringify(data);
  },
  deserialize: (data) => {
    console.log("📦 Restoring from localStorage");
    return JSON.parse(data);
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  useScrollRestore();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24,
      }}
    >
      <AuthProvider>
        <LanguageProvider>
          <IntWrapper>
           <ToastProvider>
             <LearningSessionProvider>{children}</LearningSessionProvider>
           </ToastProvider>
          </IntWrapper>
        </LanguageProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  );
}
