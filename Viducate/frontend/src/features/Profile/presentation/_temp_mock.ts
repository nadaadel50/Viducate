// ⚠️ TEMP FILE - يتشال لما الـ API يجهز
// Types هتتنقل لـ domain/entity والـ data هتيجي من الـ API

// --- Types ---
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export type AppearanceMode = 'light' | 'dark';
export type AppLanguage = 'en' | 'ar';

export interface UserPreferences {
  appearance: AppearanceMode;
  language: AppLanguage;
}

// --- Mock Data ---
export const mockUser: UserProfile = {
  firstName: 'Alex',
  lastName: 'Chen',
  email: 'alex@university.edu',
};

export const mockPreferences: UserPreferences = {
  appearance: 'light',
  language: 'en',
};
