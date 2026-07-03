import type { User } from "../../domain/entity/user";

export type UserDTO = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  study_field: string;
  language_preference: string;
  account_status: string;
  created_at: string;
};

export function toUserEntity(dto: UserDTO): User {
  return {
    id: dto.id,
    first_name: dto.first_name,
    last_name: dto.last_name,
    email: dto.email,
    study_field: dto.study_field,
    language_preference: dto.language_preference,
  };
}
