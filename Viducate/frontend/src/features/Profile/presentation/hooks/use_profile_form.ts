import { useState } from 'react';
import type  { UserProfile } from '../_temp_mock';

interface SaveMessage {
  type: 'success' | 'error' | '';
  text: string;
}

export function useProfileForm(initialUser: UserProfile) {
  const [firstName, setFirstName]           = useState(initialUser.firstName);
  const [lastName, setLastName]             = useState(initialUser.lastName);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving]             = useState(false);
  const [saveMessage, setSaveMessage]       = useState<SaveMessage>({ type: '', text: '' });

  const resetPasswordFields = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setSaveMessage({ type: 'error', text: 'New passwords do not match.' });
        return;
      }
      if (newPassword.length < 8) {
        setSaveMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
        return;
      }
    }

    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });

    // TODO: استبدل بـ real API call
    setTimeout(() => {
      setIsSaving(false);
      resetPasswordFields();
      setSaveMessage({ type: 'success', text: 'Changes saved successfully.' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
    }, 1000);
  };

  return {
    fields: { firstName, lastName, currentPassword, newPassword, confirmPassword },
    setters: { setFirstName, setLastName, setCurrentPassword, setNewPassword, setConfirmPassword },
    state:   { isSaving, saveMessage },
    handleSave,
  };
}
