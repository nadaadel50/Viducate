import { useState } from "react";

import { SecurityContext } from "./security_context";
import { ProfileContext } from "./profile_context";
import { PersonalInfoContext } from "./profle_info_context";

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  // Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [initialFirstName, setInitialFirstName] = useState("");
  const [initialLastName, setInitialLastName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  // Security
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Shared
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <ProfileContext.Provider value={{ showDeleteModal, setShowDeleteModal }}>
      <PersonalInfoContext.Provider
        value={{
          firstName, setFirstName,
          initialFirstName, setInitialFirstName,
          lastName, setLastName,
          initialLastName, setInitialLastName,
          firstNameError, setFirstNameError,
          lastNameError, setLastNameError,
          hasPassword,setHasPassword,
        }}
      >
        <SecurityContext.Provider
          value={{
            password,
            setPassword,
            oldPassword,
            setOldPassword,
            confirmPassword,
            setConfirmPassword,
            newPasswordError,
            setNewPasswordError,
            confirmPasswordError,
            setConfirmPasswordError,
          }}
        >
          {children}
        </SecurityContext.Provider>
      </PersonalInfoContext.Provider>
    </ProfileContext.Provider>
  );
}
