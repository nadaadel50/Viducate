import { LogOut } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { CustomButton } from "../../../../core/componants/custum_btn";

type SignOutButtonProps = {
  onSignOut?: () => void;
};

export function SignOutButton({ onSignOut }: SignOutButtonProps) {
  return (
    <div className="pt-2">
      <CustomButton
        type="button"
        variant="outline"
        onClick={onSignOut}
        className="w-full "
      >
        <LogOut className="size-4" />

        <FormattedMessage id="profile.signOut" defaultMessage="Sign Out" />
      </CustomButton>
    </div>
  );
}
