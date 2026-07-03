import { FormattedMessage } from "react-intl";

interface SectionTitleProps {
  titleId: string;
  danger?: boolean;
}

export function SectionTitle({ titleId, danger = false }: SectionTitleProps) {
  return (
    <h3
      className={`text-lg font-display font-bold mb-2 border-b pb-2 ${
        danger
          ? "text-red-600 border-red-100"
          : "text-slate-900 border-slate-100"
      }`}
    >
      <FormattedMessage id={titleId} />
    </h3>
  );
}
