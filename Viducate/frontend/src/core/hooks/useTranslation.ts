import { useIntl } from "react-intl";

export function useT() {
  const intl = useIntl();

  const translation = (id: string) => intl.formatMessage({ id });

  return { translation };
}
