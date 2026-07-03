import { LoginRequest } from "../../../domain/entity/login_request";

export type LoginRequestDto = {
  email: string;
  password: string;
};

export function toLoginRequestDto(entity: LoginRequest): LoginRequestDto {
  return {
    email: entity.email,
    password: entity.password,
  };
}
