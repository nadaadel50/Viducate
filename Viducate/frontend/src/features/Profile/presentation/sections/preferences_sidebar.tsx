import { motion } from "framer-motion";

import { useLanguage } from "../../../../core/hooks/useLanguage";
import { SidebarHeader } from "../components/sidebar_header";
import { LanguageSection } from "../components/language_section";
import { SignOutButton } from "../components/signout_btn";


interface PreferencesSidebarProps {
preferences: {
  language_preference: string;
};
  onSignOut?: () => void;
}

export function PreferencesSidebar({
  
  onSignOut,
}: PreferencesSidebarProps) {

  const { locale, setLocale } = useLanguage();

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md lg:sticky lg:top-8"
    >
      <SidebarHeader />

      <div className="space-y-6">
        

        <LanguageSection locale={locale} setLocale={setLocale} />

        <SignOutButton onSignOut={onSignOut} />
      </div>
    </motion.aside>
  );
}
