import type { DashboardUser } from "../../domain/entity/user";

export type UserDto = {
  name: string;
};

export function mapUserDtoToEntity(dto: UserDto): DashboardUser {
  return {
    name: dto.name,
  };
}
