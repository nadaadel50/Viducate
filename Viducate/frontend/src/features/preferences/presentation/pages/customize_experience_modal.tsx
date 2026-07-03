import React from "react";

import { BaseModal } from "../../../../core/componants/base_modal";

import { LoadingPreferences } from "../componants/loading_pref";
import { useCustomizeExperience } from "../hooks/use_custumize";
import { CustomizeContent } from "../widgets/custumize_content";
import { CustomizeFooter } from "../widgets/custumize_footer";
import { CustomizeHeader } from "../widgets/custumize_header";

interface CustomizeProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: number | null | undefined;
}

export const CustomizeExperienceModal: React.FC<CustomizeProps> = ({
  isOpen,
  onClose,
  videoId,
}) => {
  const {
    prefs,
    handlePreferenceChange,

    isLoading,
    isSubmitting,

    serverError,
    clearError,

    handleSave,
    saveError,
    getSessionsError,
  } = useCustomizeExperience(videoId, onClose);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-5xl">
      {isLoading ? (
        <LoadingPreferences />
      ) : saveError || getSessionsError ? (
        <div className="text-red-500">
          {saveError || getSessionsError?.message}
        </div>
      ) : (
        <>
          <CustomizeHeader onClose={onClose} />

          <CustomizeContent
            prefs={prefs}
            serverError={serverError}
            clearError={clearError}
            onPreferenceChange={handlePreferenceChange}
          />

          <CustomizeFooter
            isSubmitting={isSubmitting}
            onClose={onClose}
            onSave={handleSave}
          />
        </>
      )}
    </BaseModal>
  );
};
