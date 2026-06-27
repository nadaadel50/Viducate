import { motion } from "framer-motion";
import { mockPreferences } from "../_temp_mock";
import { useDeleteAccount } from "../hooks/use_delete_account";
import { usePreferences } from "../hooks/use_preferences";
import { UserHeroCard } from "../sections/user_hero_card";
import { AccountSettingsForm } from "../sections/account_settings_form";
import { PreferencesSidebar } from "../sections/preferences_sidebar";
import { AuthContext } from "../../../auth/presentation/context/auth_context";
import { useContext } from "react";
import { useGetUserData } from "../hooks/use_get_user_data";
import { COLORS } from "../../../../core/constants";
import { useProfileContext } from "../hooks/use_profile_context";
import { ConfirmationModal } from "../../../../core/componants/confirmation_modal";
import LoadingScreen from "../../../../core/componants/loading_screen";
import ErrorScreen from "../../../../core/componants/error_screen";

export function ProfilePage() {
  const { showDeleteModal } = useProfileContext();

  const deleteAccount = useDeleteAccount();

  const preferences = usePreferences({
    appearance: mockPreferences.appearance,
  });

  const auth = useContext(AuthContext);

  const handleSignOut = () => {
    auth?.logout();
  };

  const { isLoading, error } = useGetUserData();

  if (isLoading) {
    return (
      <LoadingScreen
        smallText="Almost there..."
        bigText="Setting up your profile"
      />
    );
  }

  if (error) {
    return <ErrorScreen errorMessage={error.message} />;
  }

  return (
    <div
      style={{ background: COLORS.background.radialGradient }}
      className="min-h-screen font-display text-slate-900 transition-colors duration-200 selection:bg-primary/20 px-4 sm:px-6 lg:px-8 py-6 md:py-8 scale[0.95]"
    >
      <main className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
        >
          <div className="lg:col-span-8 space-y-3">
            <UserHeroCard />
            <AccountSettingsForm />
          </div>

          <div className="lg:col-span-4">
            <PreferencesSidebar
              preferences={preferences}
              onSignOut={handleSignOut}
            />
          </div>
        </motion.div>
      </main>

      <ConfirmationModal
        open={showDeleteModal}
        title="Delete Account"
        description="All of your data will be permanently removed. This action cannot be undone."
        confirmText="Delete Account"
        isLoading={deleteAccount.isDeleting}
        onClose={deleteAccount.closeModal}
        onConfirm={deleteAccount.handleDelete}
      />
    </div>
  );
}