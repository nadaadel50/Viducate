import { motion } from 'framer-motion';
import  { mockUser, mockPreferences } from '../_temp_mock';
import { useProfileForm }    from '../hooks/use_profile_form';
import { useDeleteAccount }  from '../hooks/use_delete_account';
import { usePreferences }    from '../hooks/use_preferences';
import { UserHeroCard }         from '../sections/user_hero_card';
import { AccountSettingsForm }  from '../sections/account_settings_form';
import { PreferencesSidebar }   from '../sections/preferences_sidebar';
import { DeleteAccountModal }   from '../components/delete_account_modal';
 import { AuthContext } from '../../../auth/presentation/context/auth_context';
import { useContext } from 'react';

export function ProfilePage() {
  // 
  const form          = useProfileForm(mockUser);
  const deleteAccount = useDeleteAccount();
  const preferences   = usePreferences({ appearance: mockPreferences.appearance });
const auth = useContext(AuthContext);
const handleSignOut = () => {
    auth?.logout();
  };

  return (
    <div className="min-h-screen bg-background-light text-slate-900 py-10 px-4 sm:px-6 lg:px-8 font-body flex flex-col transition-colors duration-200 selection:bg-primary/20">
      <main className="flex-grow w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            <UserHeroCard user={mockUser} />
            <AccountSettingsForm form={form} deleteAccount={deleteAccount} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <PreferencesSidebar preferences={preferences} onSignOut={handleSignOut} />
          </div>
        </motion.div>
      </main>

      <DeleteAccountModal
        show={deleteAccount.showModal}
        isDeleting={deleteAccount.isDeleting}
        onConfirm={deleteAccount.handleDelete}
        onCancel={deleteAccount.closeModal}
      />
    </div>
  );
}
