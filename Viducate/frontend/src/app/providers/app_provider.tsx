import { LanguageProvider } from "../../core/contexts/languageContext/languageProvider";
import { IntWrapper } from "../../core/l10n/intWrapper";
import { AuthProvider } from "../../features/auth/presentation/context/auth_provider";
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>        
        <IntWrapper>
          {children}
        </IntWrapper>
      </LanguageProvider>
    </AuthProvider>
  );
}
