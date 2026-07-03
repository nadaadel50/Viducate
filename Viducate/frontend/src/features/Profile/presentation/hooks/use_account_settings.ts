import { useEffect } from "react";
import { useUpdate } from "./use_update_profile";
import {
  usePersonalInfoContext,
  useSecurityContext,
} from "./use_profile_context";
import { useHandleInputs } from "./use_handle_inputs";

export function useAccountSettings() {
  const { updateProfile, isLoadingUpdate, error, isSuccess } = useUpdate();

  const { firstName, lastName, initialFirstName, initialLastName } =
    usePersonalInfoContext();

  const {
    password,
    oldPassword,
    confirmPassword,
    newPasswordError,
    confirmPasswordError,
  } = useSecurityContext();

  const { resetAll, successUpdateReset } = useHandleInputs();

  const passwordTouched = Boolean(password || oldPassword);

  const hasChanges =
    firstName !== initialFirstName ||
    lastName !== initialLastName ||
    passwordTouched;

  const passwordComplete =
    !passwordTouched ||
    (Boolean(password) && Boolean(oldPassword) && Boolean(confirmPassword));

  const disabled =
    isLoadingUpdate ||
    !hasChanges ||
    !passwordComplete ||
    Boolean(newPasswordError) ||
    Boolean(confirmPasswordError);

  const handleCancel = () => {
    resetAll();
  };

  const handleSave = () => {
    updateProfile({
      first_name: firstName,
      last_name: lastName,
      current_password: oldPassword,
      new_password: password,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      successUpdateReset();
    }
  }, [isSuccess, successUpdateReset]);

  return {
    isLoadingUpdate,
    isSuccess,
    error,
    disabled,
    handleCancel,
    handleSave,
  };
}
