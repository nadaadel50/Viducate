import { BaseModal } from "../../../../core/componants/base_modal";
import { FormattedMessage } from "react-intl";
import { COLORS } from "../../../../core/constants";

interface LanguageInitProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomize: () => void;
}

export const LanguageInitModal = ({
  isOpen,
  onClose,
  onCustomize,
}: LanguageInitProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[480px]">
      <div className="p-6 md:p-8 flex flex-col items-center text-center">
        <div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br  text-white shadow-lg shadow-[#5A0BB1]/20"
          style={{ background: COLORS.brand.gradient }}
        >
          <span className="material-symbols-outlined text-[40px]">
            translate
          </span>
        </div>

        <h2
          className="text-2xl font-bold leading-tight tracking-tight dark:text-white mb-3"
          style={{ color: COLORS.text.primary }}
        >
          <FormattedMessage id="languageInit.title" />
        </h2>

        <p
          className="text-base font-normal leading-relaxed dark:text-slate-400 mb-8 px-2"
          style={{ color: COLORS.text.secondary }}
        >
          <FormattedMessage id="languageInit.desc" />
        </p>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-lg font-bold transition-all"
            style={{
              border: `1px solid ${COLORS.border.default}`,
              color: COLORS.text.secondary,
            }}
          >
            <FormattedMessage id="languageInit.noContinue" />
          </button>
          <button
            onClick={onCustomize}
            className="flex-1 h-12 rounded-lg text-white font-bold shadow-md transition-all"
            style={{ background: COLORS.brand.gradient }}
          >
            <FormattedMessage id="languageInit.yesCustomize" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          <span>
            {" "}
            <FormattedMessage id="languageInit.secure" />
          </span>
        </div>
      </div>
    </BaseModal>
  );
};
