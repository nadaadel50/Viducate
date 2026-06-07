import { useState } from "react";
import type { UserProfile } from "../_temp_mock";

interface SaveMessage {
  type: "success" | "error" | "";
  messageId: string;
}

export function useProfileForm(initialUser: UserProfile) {
  const [firstName, setFirstName] = useState(initialUser.firstName);
  const [lastName, setLastName] = useState(initialUser.lastName);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const [saveMessage, setSaveMessage] = useState<SaveMessage>({
    type: "",
    messageId: "",
  });

  const resetPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Password validation
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setSaveMessage({
          type: "error",
          messageId: "profile.password.mismatch",
        });
        return;
      }

      if (newPassword.length < 8) {
        setSaveMessage({
          type: "error",
          messageId: "profile.password.minLength",
        });
        return;
      }
    }

    setIsSaving(true);
    setSaveMessage({ type: "", messageId: "" });

    // TODO: replace with real API call
    setTimeout(() => {
      setIsSaving(false);
      resetPasswordFields();

      setSaveMessage({
        type: "success",
        messageId: "profile.save.success",
      });

      // clear message after 3s
      setTimeout(() => {
        setSaveMessage({ type: "", messageId: "" });
      }, 3000);
    }, 1000);
  };

  return {
    fields: {
      firstName,
      lastName,
      currentPassword,
      newPassword,
      confirmPassword,
    },

    setters: {
      setFirstName,
      setLastName,
      setCurrentPassword,
      setNewPassword,
      setConfirmPassword,
    },

    state: {
      isSaving,
      saveMessage,
    },

    handleSave,
  };
}
