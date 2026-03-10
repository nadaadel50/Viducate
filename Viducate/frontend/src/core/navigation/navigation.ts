import type { NavigateFunction } from "react-router-dom";
import { AppRoutesNames } from "../../app/routers/routes";

// Navigation helpers
export function goToHome(navigate: NavigateFunction) {
  navigate(AppRoutesNames.home);
}

export function goToLogin(navigate: NavigateFunction) {
  navigate(AppRoutesNames.login);
}

