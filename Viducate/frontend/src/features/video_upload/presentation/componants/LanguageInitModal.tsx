import { BaseModal } from '../../../../core/componants/base_modal';
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
interface LanguageInitProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomize: () => void;

}

export const LanguageInitModal = ({ isOpen, onClose, onCustomize }: LanguageInitProps) => {
  const navigate = useNavigate();
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[480px]">
      <div className="p-6 md:p-8 flex flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] text-white shadow-lg shadow-[#5A0BB1]/20">
          <span className="material-symbols-outlined text-[40px]">translate</span>
        </div>
        
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-[#141118] dark:text-white mb-3">
          <FormattedMessage id="languageInit.title" />
        </h2>
        
        <p className="text-base font-normal leading-relaxed text-[#756388] dark:text-slate-400 mb-8 px-2">
          <FormattedMessage id="languageInit.desc" />
        </p>
        
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <button onClick={() => navigate('/processing')} className="flex-1 h-12 rounded-lg border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <FormattedMessage id="languageInit.noContinue" />
          </button>
          <button onClick={onCustomize} className="flex-1 h-12 rounded-lg bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] text-white font-bold shadow-md shadow-[#5A0BB1]/20 hover:opacity-90 hover:shadow-[#5A0BB1]/40 transition-all">
            <FormattedMessage id="languageInit.yesCustomize" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          <span> <FormattedMessage id="languageInit.secure" /></span>
        </div>
      </div>
    </BaseModal>
  );
};