interface SectionTitleProps {
  title: string;
  danger?: boolean;
}

export function SectionTitle({ title, danger = false }: SectionTitleProps) {
  return (
    <h3
      className={`text-lg font-display font-bold mb-6 border-b pb-3 ${
        danger ? 'text-red-600 border-red-100' : 'text-slate-900 border-slate-100'
      }`}
    >
      {title}
    </h3>
  );
}
