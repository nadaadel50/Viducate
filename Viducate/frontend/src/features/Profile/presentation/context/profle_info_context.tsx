import { createContext } from "react";

export type PersonalInfoContextType = {
  firstName: string;
  setFirstName: (name: string) => void;
  initialFirstName: string;
  setInitialFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  initialLastName: string;
  setInitialLastName: (name: string) => void;
  firstNameError: string;
  setFirstNameError: (error: string) => void;
  lastNameError: string;
  setLastNameError: (error: string) => void;

  hasPassword: boolean;
  setHasPassword: (value: boolean) => void;
};

export const PersonalInfoContext =
  createContext<PersonalInfoContextType | null>(null);
