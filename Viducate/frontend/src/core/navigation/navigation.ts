import type { NavigateFunction } from "react-router";
import { AppRoutesNames } from "../../app/routers/routes";

// Navigation helpers
// export function goToHome(navigate: NavigateFunction) {
//   navigate(AppRoutesNames.home);
// }

export function goToLogin(navigate: NavigateFunction) {
  navigate(AppRoutesNames.login);
}
export function goToForgotPassword(navigate: NavigateFunction) {
  navigate(AppRoutesNames.forgotPassword);
}

export function goToLSuccessSendEmail(navigate: NavigateFunction,email:string) {
  navigate(AppRoutesNames.sucessSendEmail,{
    state:{email}
  });
}
export function goToRestPassword(navigate: NavigateFunction) {
  navigate(AppRoutesNames.restPass);
}

export function goToSuccessResetPassword(navigate: NavigateFunction) {
  navigate(AppRoutesNames.successRestPass,{replace:true});
}


