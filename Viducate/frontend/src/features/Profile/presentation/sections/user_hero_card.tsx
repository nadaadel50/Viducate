import { COLORS } from "../../../../core/constants/colors";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { useGetUserData } from "../hooks/use_get_user_data";

export function UserHeroCard() {
  const { data: userData } = useGetUserData();

  return (
    <section className="bg-white rounded-[1.25rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 sm:gap-6 text-center sm:text-left">
        {/* Avatar */}
        <div className="relative flex-shrink-0 group">
          <div
            className="size-22 rounded-full border-white shadow-md overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
            style={{
              background: COLORS.brand.gradient,
            }}
          >
            <svg className="w-full h-full opacity-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="50" fill="none" />

              <path
                d="M15 95 C15 65, 85 65, 85 95 L85 100 L15 100 Z"
                fill="#ffffff"
                opacity="0.9"
              />

              <circle
                cx="50"
                cy="45"
                r="22"
                fill="#ffffff"
                opacity="0.95"
              />
            </svg>
          </div>

         
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start">
          <h1
            className={`${FONT_STYLES.heroTitle} text-slate-900 break-words `}
          >
            {userData?.first_name} {userData?.last_name} 
          </h1>

          <p
            className={`${FONT_STYLES.heroSubtitle} break-all mt-1`}
          >
            {userData?.email}
          </p>
        </div>
      </div>
    </section>
  );
}