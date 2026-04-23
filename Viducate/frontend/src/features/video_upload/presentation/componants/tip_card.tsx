import { Lightbulb } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

export const TipCard = () => {
  return (
    <div className="mt-0 max-w-md w-full">
        <div className="bg-white/60 backdrop-blur-md border border-white/60 shadow-sm p-5 rounded-xl text-center">
          <div className="inline-flex items-center justify-center size-10 bg-white rounded-full shadow-sm mb-3 text-[#4f46e5]">
            <Lightbulb className="size-5" />
          </div>
          <h4 className="text-[#0F172A] font-bold text-sm uppercase tracking-wider mb-2">
            <FormattedMessage id="analysis.tip.title" />
          </h4>
          <p className="text-[#475569] text-sm leading-relaxed">
            <FormattedMessage id="analysis.tip.desc" />
          </p>
        </div>
      </div>
  );
};