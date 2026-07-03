import { IntlProvider } from "react-intl";
import { useLanguage } from "../hooks/useLanguage";
import { messages } from ".";

type IntWrapperProps = {
  children: React.ReactNode;
};

export function IntWrapper({ children }: IntWrapperProps) {
  const { locale } = useLanguage();
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </IntlProvider>
  );
}
