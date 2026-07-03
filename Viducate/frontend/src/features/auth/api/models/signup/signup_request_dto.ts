import { SignupRequest } from "../../../domain/entity/signup_request";

export type SignupRequestDto = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export function toSignupRequestDto(entity: SignupRequest): SignupRequestDto {
  return {
    first_name: entity.firstName,
    last_name: entity.lastName,
    email: entity.email,
    password: entity.password,
  };
}
