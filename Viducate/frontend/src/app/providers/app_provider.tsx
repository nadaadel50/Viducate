import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "../../core/contexts/languageContext/languageProvider";
import { useScrollRestore } from "../../core/hooks/useScrollRestore";
import { IntWrapper } from "../../core/l10n/intWrapper";
import { AuthProvider } from "../../features/auth/presentation/context/auth_provider";
import { VideoIdProvider } from "../../core/contexts/VideoContext/videoIdProvider";
const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
    useScrollRestore();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>        
        <LanguageProvider>
          <IntWrapper>
            <VideoIdProvider>
            {children}
              </VideoIdProvider> 
          </IntWrapper>
        </LanguageProvider>           
      </AuthProvider>
    </QueryClientProvider>
  );
}