
import {  Download } from 'lucide-react';
import { COLORS } from '../../../../core/constants/colors';
import { FormattedMessage } from "react-intl";
export const ToolsCard = () => (
  <div 
    className="rounded-xl shadow-sm   p-2 flex flex-col"
    style={{ backgroundColor: COLORS.layout.leftBackground }}
  >
    <p className="px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: COLORS.text.muted }}>
       <FormattedMessage id="summary.tools" />
    </p>
    <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group">
      
      <div className="size-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
        <span className="material-symbols-outlined">picture_as_pdf</span>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold" style={{ color: COLORS.text.primary }}>
          <FormattedMessage id="summary.exportPdf" />
        </h4>
        <p className="text-xs" style={{ color: COLORS.text.secondary }}>
          <FormattedMessage id="summary.downloadOffline" />
        </p>
      </div>
      <Download className="w-5 h-5" style={{ color: COLORS.text.muted }} />
    </button>
  </div>
);