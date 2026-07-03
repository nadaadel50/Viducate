import { createContext } from "react";

export type ProfileContextType = {
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
};

export const ProfileContext = createContext<ProfileContextType | null>(null);
