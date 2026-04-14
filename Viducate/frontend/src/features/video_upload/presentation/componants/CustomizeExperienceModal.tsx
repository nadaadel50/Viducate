import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { BaseModal } from '../../../../core/componants/base_modal';
import CustumBtnLoader  from '../../../../core/componants/custum_btn_loader';
import {CustumError} from '../../../../core/componants/custum_error';
import { PreferenceCard } from './PreferenceCard';
import { FormattedMessage } from "react-intl";
import { COLORS } from "../../../../core/constants/colors";
interface CustomizeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomizeExperienceModal: React.FC<CustomizeProps> = ({ isOpen, onClose }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [prefs, setPrefs] = useState({ 
    summary: 'English', 
    quiz: 'English', 
    flashcards: 'English', 
    isUnified: false 
  });
  const getDisplayValue = (currentValue: string) => {
    return prefs.isUnified ? "preferred Language": currentValue;
  };
const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
     try {
    setIsSaving(true);
    console.log("Saving Preferences:", prefs);
    // fake delay أو API call
    await new Promise((res) => setTimeout(res, 1000));
    //await savePreferences(prefs); //  API CALL حقيقي

    onClose();
    navigate("/processing");
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
          <h1 className="text-2xl font-bold tracking-tight text-[#111318] dark:text-white">
            <FormattedMessage id="customize.title" />
          </h1>
          <p className="text-sm text-[#616f89] dark:text-gray-400">
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
        {/* Unified Toggle Box */}
        <div className={`flex items-center justify-between p-4 mb-8 rounded-xl border transition-all duration-300 ${
          prefs.isUnified 
            ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800' 
            : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700'
        }`}>
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-full text-white transition-colors"
              style={{
              background: prefs.isUnified ? COLORS.brand.gradient : undefined,
               backgroundColor: !prefs.isUnified ? '#9CA3AF' : undefined
              }}
            >
            <span className="material-symbols-outlined">translate</span>
          </div>
            <div className="flex flex-col text-left">
              <span className="font-semibold text-sm text-[#111318] dark:text-white"><FormattedMessage id="customize.unified.title" /></span>
              <span className="text-xs text-[#616f89] dark:text-gray-400">
                {prefs.isUnified 
                   ? <FormattedMessage id="customize.language.unified.enabled" />
                   : <FormattedMessage id="customize.language.unified.disabled" />
                }
              </span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={prefs.isUnified} 
              onChange={(e) => setPrefs({...prefs, isUnified: e.target.checked})} 
              className="sr-only peer" 
            />
            <div
                className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative
                           peer-focus:outline-none after:content-['']
                           after:absolute after:top-[2px] after:left-[2px]
                           after:bg-white after:border after:border-gray-300
                           after:rounded-full after:h-5 after:w-5 after:transition-all
                           peer-checked:after:translate-x-full"
              style={{
              backgroundColor: prefs.isUnified ? COLORS.button.primary : undefined,
            }}
          />
        </label>
      </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PreferenceCard 
            title="Summary" 
            icon="summarize" 
            desc="Set the output language for video summaries." 
            value={getDisplayValue(prefs.summary)} 
            onChange={(v: string) => setPrefs({...prefs, summary: v})} 
            disabled={prefs.isUnified} 
            iconBgClass="bg-blue-50 dark:bg-blue-900/20"
            iconTextClass="text-blue-600"
          />
          <PreferenceCard 
            title="Quiz" 
            icon="quiz" 
            desc="Choose the language for your practice questions." 
            value={getDisplayValue(prefs.quiz)} 
            onChange={(v: string) => setPrefs({...prefs, quiz: v})} 
            disabled={prefs.isUnified} 
            iconBgClass="bg-purple-50 dark:bg-purple-900/20"
            iconTextClass="text-purple-600"
          />
          <PreferenceCard 
            title="Flashcards" 
            icon="style" 
            desc="Choose the language for your revision flashcards." 
            value={getDisplayValue(prefs.flashcards)} 
            onChange={(v: string) => setPrefs({...prefs, flashcards: v})} 
            disabled={prefs.isUnified} 
            iconBgClass="bg-green-50 dark:bg-green-900/20"
            iconTextClass="text-green-600"
          />
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-2xl">
        <button onClick={() => navigate('/processing')} className="h-12 px-6 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <FormattedMessage id="customize.skip" />
        </button>
        <button onClick={handleSave} className="h-12 px-8 rounded-xl bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] text-white text-sm font-bold shadow-md hover:shadow-lg hover:shadow-[#5A0BB1]/30 hover:-translate-y-0.5 transition-all">
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