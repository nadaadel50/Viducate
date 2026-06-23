import { motion } from "framer-motion";
import { mockUser, mockPreferences } from "../_temp_mock";
import { useDeleteAccount } from "../hooks/use_delete_account";
import { usePreferences } from "../hooks/use_preferences";
import { UserHeroCard } from "../sections/user_hero_card";
import { AccountSettingsForm } from "../sections/account_settings_form";
import { PreferencesSidebar } from "../sections/preferences_sidebar";
import { AuthContext } from "../../../auth/presentation/context/auth_context";
import { use, useContext } from "react";
import { LoadingScreen } from "../../../../core/componants/LoadingScreen";
import { Brain } from "lucide-react";
import { useGetUserData } from "../hooks/use_get_user_data";
import { ErrorMessage } from "../../../../core/widgets/error";
import { COLORS } from "../../../../core/constants";
import { useProfileContext } from "../hooks/use_profile_context";
import { DeleteModal } from "../../../../core/componants/delete_modal";

export function ProfilePage() {
  //

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
        icon={<Brain />}
        titlePrefix="Building your"
        titleHighlight="Mind Map"
        subtitle="Analyzing the lecture structure and organizing key concepts..."
      />
    );
  }
  if (error) return <ErrorMessage errorMessage={error.message} />;

  return (
    <div
      style={{ background: COLORS.background.radialGradient }}
      className="min-h-screen  text-slate-900 py-7 px-4  font-display flex flex-col transition-colors duration-200 selection:bg-primary/20"
    >
      <main className="flex-grow w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            <UserHeroCard />
            <AccountSettingsForm />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <PreferencesSidebar
              preferences={preferences}
              onSignOut={handleSignOut}
            />
          </div>
        </motion.div>
      </main>

      {/* <DeleteModal
        show={showDeleteModal}
        isDeleting={deleteAccount.isDeleting}
        onConfirm={deleteAccount.handleDelete}
        onCancel={deleteAccount.closeModal}
      /> */}

      <DeleteModal
        open={showDeleteModal}
        title="Delete Account"
        description="All of your data will be permanently removed. This action cannot be undone."
        confirmText="Delete Account"
        isLoading={deleteAccount.isDeleting}
        onClose={() => deleteAccount.closeModal}
        onConfirm={deleteAccount.handleDelete}
      />
    </div>
  );
}
