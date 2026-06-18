import { AlertTriangle, Trash2 } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { SectionTitle } from "../components/section_title";
import { useProfileContext } from "../hooks/use_profile_context";

export function DeleteAccount() {
  const {  setShowDeleteModal } = useProfileContext();
    return(
         <div className="  border-slate-100">
          <SectionTitle titleId="profile.section.deleteAccount" danger />

          <div className="p-6 sm:p-8 bg-red-50/70 border border-red-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-red-50 hover:shadow-sm">
            <div className="flex-1 text-center md:text-left">
              <p className="text-base font-semibold text-red-800 mb-1.5 flex items-center justify-center md:justify-start gap-2">
                <AlertTriangle size={18} />

                <FormattedMessage
                  id="profile.delete.warning"
                  defaultMessage="Warning: Irreversible action"
                />
              </p>

              <p className="text-sm text-red-700/90 leading-relaxed max-w-lg">
                <FormattedMessage
                  id="profile.delete.description"
                  defaultMessage="Once you delete your account, there is no going back. Please be certain before proceeding."
                />
              </p>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full md:w-auto whitespace-nowrap px-8 py-3.5 bg-[#e11d48] text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />

              <FormattedMessage
                id="profile.delete.btn"
                defaultMessage="Delete Account"
              />
            </button>
          </div>
        </div>
    )
}