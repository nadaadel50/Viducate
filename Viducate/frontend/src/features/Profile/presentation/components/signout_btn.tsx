import { LogOut } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { CustomButton } from "../../../../core/componants/custum_btn";
import { COLORS } from "../../../../core/constants";

type SignOutButtonProps = {
  onSignOut?: () => void;
};

export function SignOutButton({ onSignOut }: SignOutButtonProps) {
  return (
    <div className="pt-2">
      <CustomButton
        type="button"
        style={{ background: COLORS.button.primary }}
        onClick={onSignOut}
        className="w-full text-white"
      >
        <LogOut className="size-4" />

        <FormattedMessage id="profile.signOut" defaultMessage="Sign Out" />
      </CustomButton>
    </div>
  );
}
