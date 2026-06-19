import { motion } from "framer-motion";
import { Settings2, Sun, Moon, Check, LogOut } from "lucide-react";
import { FormattedMessage } from "react-intl";
import type { usePreferences } from "../hooks/use_preferences";
import { COLORS } from "../../../../core/constants/colors";
import { useLanguage } from "../../../../core/hooks/useLanguage";

interface PreferencesSidebarProps {
  preferences: ReturnType<typeof usePreferences>;
  onSignOut?: () => void;
}

export function PreferencesSidebar({
  preferences,
  onSignOut,
}: PreferencesSidebarProps) {
  const { appearance, setAppearance } = preferences;
  const { locale, setLocale } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-8 hover:shadow-md transition-shadow duration-300 max-w-[520px]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <Settings2 size={22} style={{ color: COLORS.brand.primary }} />
        <h3 className="text-lg font-display font-bold text-slate-900">
          <FormattedMessage
            id="profile.preferences.title"
            defaultMessage="Preferences"
          />
        </h3>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 block">
            <FormattedMessage
              id="profile.preferences.appearance"
              defaultMessage="Appearance"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["light", "dark"] as const).map((mode) => {
              const isActive = appearance === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setAppearance(mode)}
                  className="group flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200"
                  style={{
                    borderColor: isActive ? COLORS.brand.primary : "#f1f5f9",
                    backgroundColor: isActive
                      ? `${COLORS.brand.primary}10`
                      : "#ffffff",
                    color: isActive ? COLORS.brand.primary : "#64748b",
                    boxShadow: isActive
                      ? `0 4px 14px ${COLORS.brand.primary}20`
                      : "none",
                  }}
                >
                  {mode === "light" ? (
                    <Sun
                      size={18}
                      className="mb-2 transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <Moon
                      size={18}
                      className="mb-2 transition-transform group-hover:scale-110"
                    />
                  )}
                  <span className="text-[11px] font-bold capitalize">
                    <FormattedMessage
                      id={`profile.preferences.${mode}`}
                      defaultMessage={mode}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 block">
            <FormattedMessage
              id="profile.preferences.language"
              defaultMessage="Language"
            />
          </label>
          <div className="space-y-3">
            {[
              { code: "en" as const, flag: "🇺🇸", labelId: "profile.lang.en" },
              { code: "ar" as const, flag: "🇸🇦", labelId: "profile.lang.ar" },
            ].map((lang) => {
              const isActive = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLocale(lang.code)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left"
                  style={{
                    borderColor: isActive ? COLORS.brand.primary : "#f1f5f9",
                    backgroundColor: isActive
                      ? `${COLORS.brand.primary}10`
                      : "#ffffff",
                    color: isActive ? COLORS.brand.primary : "#475569",
                    boxShadow: isActive
                      ? `0 4px 14px ${COLORS.brand.primary}20`
                      : "none",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-bold">
                      <FormattedMessage
                        id={lang.labelId}
                        defaultMessage={lang.code}
                      />
                    </span>
                  </div>
                  {isActive && (
                    <Check size={18} style={{ color: COLORS.brand.primary }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sign Out */}
        <div className="pt-2">
          <button
            onClick={onSignOut}
            className="w-full py-3 flex items-center justify-center gap-2 border rounded-xl text-sm font-bold transition-all shadow-sm"
            style={{
              borderColor: COLORS.brand.primary,
              color: COLORS.brand.primary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${COLORS.brand.primary}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <LogOut size={16} />
            <FormattedMessage id="profile.signOut" defaultMessage="Sign Out" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
