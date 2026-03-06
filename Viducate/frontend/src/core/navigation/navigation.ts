import type { NavigateFunction } from "react-router";
import { routes } from "../../app/routers/routes";

// Navigation helpers
export function goToHome(navigate: NavigateFunction) {
  navigate(routes.home);
}

export function goToLogin(navigate: NavigateFunction) {
  navigate(routes.login);
}
export function goToForgetPass(navigate: NavigateFunction) {
  navigate(routes.forgetPass);
}

export function goToLSuccessSendEmail(navigate: NavigateFunction,email:string) {
  navigate(routes.sucessSendEmail,{
    state:{email}
  });
}
export function goToRestPassword(navigate: NavigateFunction) {
  navigate(routes.restPass);
}

export function goToSuccessResetPassword(navigate: NavigateFunction) {
  navigate(routes.successRestPass);
}

