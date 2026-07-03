export class ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;

  constructor(token: string, newPassword: string, confirmPassword: string) {
    this.token = token;
    this.confirmPassword = confirmPassword;
    this.newPassword = newPassword;
  }
}
