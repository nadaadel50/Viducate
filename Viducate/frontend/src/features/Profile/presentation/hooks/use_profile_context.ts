import { useContext } from "react";
import { PersonalInfoContext } from "../context/profle_info_context";
import { ProfileContext } from "../context/profile_context";
import { SecurityContext } from "../context/security_context";

export function usePersonalInfoContext() {
  const context = useContext(PersonalInfoContext);
  if (!context)
    throw new Error(
      "usePersonalInfoContext must be used within ProfileProvider",
    );
  return context;
}

export function useSecurityContext() {
  const context = useContext(SecurityContext);
  if (!context)
    throw new Error("useSecurityContext must be used within ProfileProvider");
  return context;
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context)
    throw new Error("useProfileContext must be used within ProfileProvider");
  return context;
}
