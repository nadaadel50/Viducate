import { COLORS } from "../../../../core/constants/colors";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { getInitials } from "../../../../core/utils/format_name";
import { useGetUserData } from "../hooks/use_get_user_data";

export function UserHeroCard() {
  const { data: userData } = useGetUserData();

  const fullName =
    `${userData?.first_name ?? ""} ${userData?.last_name ?? ""}`.trim();

  return (
    <section className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
        {/* Avatar */}
        <div
          className="flex h-22 w-22 items-center justify-center rounded-full text-2xl font-bold text-white shadow-md transition-transform duration-500 group-hover:scale-105"
          style={{
            background: COLORS.brand.gradient,
          }}
        >
          {getInitials(fullName)}
        </div>

        {/* User Info */}
        <div className="flex min-w-0 flex-1 flex-col items-center sm:items-start">
          <h1 className={`${FONT_STYLES.heroTitle} break-words text-slate-900`}>
            {fullName}
          </h1>

          <p className={`${FONT_STYLES.heroSubtitle} mt-1 break-all`}>
            {userData?.email}
          </p>
        </div>
      </div>
    </section>
  );
}
