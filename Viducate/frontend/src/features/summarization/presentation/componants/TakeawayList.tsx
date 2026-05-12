
import { Lightbulb } from 'lucide-react';
import { COLORS } from '../../../../core/constants/colors';
import { FormattedMessage } from "react-intl";
export const TakeawayList = ({ items }: { items: string[] }) => (
  <section className="mb-10">
    <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: COLORS.brand.primary }}>
      <Lightbulb className="w-6 h-6" /> <FormattedMessage id="summary.keyTakeaways" />
    </h3>

    <div 
      className="rounded-lg p-6 " 
      style={{ backgroundColor: COLORS.effects.blueGlow}}
    >
      <ul className="text-base list-disc list-outside ml-5 space-y-3 marker:text-indigo-600">
        {items.map((item, i) => (
          <li key={i} className="leading-relaxed  pl-2" style={{ color: COLORS.text.secondary }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  </section>
);