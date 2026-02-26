import type { NavigateFunction } from "react-router-dom";
import { routes } from "../../app/routers/routes";

// Navigation helpers
export function goToHome(navigate: NavigateFunction) {
  navigate(routes.home);
}

export function goToLogin(navigate: NavigateFunction) {
  navigate(routes.login);
}

