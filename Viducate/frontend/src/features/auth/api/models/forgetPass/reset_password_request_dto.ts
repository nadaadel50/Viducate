import type { ResetPasswordRequest } from "../../../domain/entity/reset_password_request";

export type ResetPasswordRequestDto = {
  token: string;
  new_password: string;
  confirm_password: string;
};
export function toResetPasswordRequestDto(
  entity: ResetPasswordRequest,
): ResetPasswordRequestDto {
  return {
    token: entity.token,
    new_password: entity.newPassword,
    confirm_password: entity.confirmPassword,
  };
}
