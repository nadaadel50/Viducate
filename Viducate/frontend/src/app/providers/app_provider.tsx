import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "../../core/contexts/languageContext/languageProvider";
import { IntWrapper } from "../../core/l10n/intWrapper";
import { AuthProvider } from "../../features/auth/presentation/context/auth_provider";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <IntWrapper>
            {children}
          </IntWrapper>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}