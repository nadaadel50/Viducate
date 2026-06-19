

import { COLORS } from "../../../../core/constants/colors";
import { useGetUserData } from "../hooks/use_get_user_data";

export function UserHeroCard() {
  const{data:userData}=useGetUserData();
  return (
    <section className="bg-white rounded-[1.25rem] p-6 border border-slate-200 shadow-sm flex  items-center gap-6 text-center  hover:shadow-md transition-shadow duration-300">
      
      {/* Avatar */}
      <div className="relative flex-shrink-0 group ">
        
        <div
          className="size-28 rounded-full  border-white shadow-md overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
          style={{
            background: COLORS.brand.gradient,
          }}
        >
            <svg
              className="w-full h-full opacity-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="50"
                fill="none"
              />

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

        {/* <button
          className="absolute bottom-1 right-1 p-2 text-white rounded-full transition-all duration-300 shadow-sm border-2 border-white flex items-center justify-center group-hover:scale-110"
          style={{
            backgroundColor: COLORS.button.primary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              COLORS.button.primaryHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              COLORS.button.primary;
          }}
          title="Upload new photo"
        >
          <Camera size={15} />
        </button> */}
      </div>

      {/* Info */}
      <div className="flex-1 py-1 flex items-start flex-col ">
        
        <h1 className="text-2xl font-display font-bold text-slate-900 mb-1 truncate">
          {userData?.first_name} {userData?.last_name}
        </h1>

        <p className="text-slate-500 text-base">
          {userData?.email}
        </p>
      </div>
    </section>
  );
}