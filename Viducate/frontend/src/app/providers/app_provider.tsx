import { LanguageProvider } from "../../core/contexts/languageContext/languageProvider";
import { useScrollRestore } from "../../core/hooks/useScrollRestore";
import { IntWrapper } from "../../core/l10n/intWrapper";
import { AuthProvider } from "../../features/auth/presentation/context/auth_provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
    useScrollRestore();
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
