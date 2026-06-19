import { UserCog } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { COLORS } from "../../../../core/constants";

export function TapHeader(){
    return(
         <div className="flex border-b border-slate-200">
        <div
          className="w-full py-5 text-center font-bold bg-slate-50/50 flex items-center justify-center gap-2 border-b-2"
          style={{
            color: COLORS.brand.primary,
            borderColor: COLORS.brand.primary,
          }}
        >
          <UserCog size={22} />

          <span className="text-[1.05rem]">
            <FormattedMessage
              id="profile.settings.title"
              defaultMessage="Account Settings"
            />
          </span>
        </div>
      </div>
    )
}