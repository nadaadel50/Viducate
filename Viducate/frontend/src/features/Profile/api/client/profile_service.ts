
import { apiClient } from "../../../../core/api/apiClient";

export const profileService = {
  updateLanguage: (language: string) =>
  apiClient.put('auth/profile/language', { language }),};

