import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { BaseModal } from '../../../../core/componants/base_modal';
import CustumBtnLoader  from '../../../../core/componants/custum_btn_loader';
import {CustumError} from '../../../../core/componants/custum_error';
import { PreferenceCard } from './PreferenceCard';
import { FormattedMessage } from "react-intl";
import { COLORS } from "../../../../core/constants/colors";
import { AppRoutesNames } from '../../../../app/routers/routes';
interface CustomizeProps {
  isOpen: boolean;
  onClose: () => void;
}
export const CustomizeExperienceModal: React.FC<CustomizeProps> = ({ isOpen, onClose }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [prefs, setPrefs] = useState({ 
  summary: 'Same as Video', 
  quiz: 'Same as Video', 
  flashcards: 'Same as Video'
});
const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
     try {
    setIsSaving(true);
    console.log("Saving Preferences:", prefs);
    // fake delay أو API call
    await new Promise((res) => setTimeout(res, 1000));
    //await savePreferences(prefs); //  API CALL حقيقي
    onClose();
    navigate(AppRoutesNames.ProcessingPage);
    } catch (error: unknown) {
    setServerError((error as Error).message || "Something went wrong");
  } finally {
    setIsSaving(false);
  }
  };

const navigate = useNavigate();
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-5xl">
      {/*  Header Section */}
      <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex flex-col gap-1 text-left">
          <h1 className="text-2xl font-bold tracking-tight dark:text-white"
              style={{ color: COLORS.text.primary }}>
            <FormattedMessage id="customize.title" />
          </h1>
          <p className="text-sm dark:text-gray-400"
             style={{ color: COLORS.text.secondary }}>
            <FormattedMessage id="customize.desc" />
          </p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors p-1">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Scrollable Content Section */}
      <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-gray-900 relative">
         {serverError && (
    <CustumError
      apiError={serverError}
      clearError={() => setServerError(null)}
    />
  )} 
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PreferenceCard 
            title="Summary" 
            icon="summarize" 
            desc="Set the output language for video summaries." 
            value={prefs.summary} 
            onChange={(v: string) => setPrefs({...prefs, summary: v})}           
            iconBgClass="bg-blue-50 dark:bg-blue-900/20"
            iconTextClass="text-blue-600"
          />
          <PreferenceCard 
            title="Quiz" 
            icon="quiz" 
            desc="Choose the language for your practice questions." 
            value={prefs.quiz}
            onChange={(v: string) => setPrefs({...prefs, quiz: v})} 
            iconBgClass="bg-purple-50 dark:bg-purple-900/20"
            iconTextClass="text-purple-600"
          />
          <PreferenceCard 
            title="Flashcards" 
            icon="style" 
            desc="Choose the language for your revision flashcards." 
            value={prefs.flashcards} 
            onChange={(v: string) => setPrefs({...prefs, flashcards: v})} 
            iconBgClass="bg-green-50 dark:bg-green-900/20"
            iconTextClass="text-green-600"
          />
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-2xl">
        <button onClick={() => navigate(AppRoutesNames.ProcessingPage)} className="h-12 px-6 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <FormattedMessage id="customize.skip" />
        </button>
        <button onClick={handleSave} className="h-12 px-8 rounded-xl  text-white text-sm font-bold shadow-md hover:shadow-lg hover:shadow-[#5A0BB1]/30 hover:-translate-y-0.5 transition-all" style={{ background: COLORS.brand.gradient }}>
         {isSaving ? (
    <CustumBtnLoader color="bg-white" />
  ) : (
  <FormattedMessage id="customize.save" />
    )}
</button>
      </div>

    </BaseModal>
  );
};