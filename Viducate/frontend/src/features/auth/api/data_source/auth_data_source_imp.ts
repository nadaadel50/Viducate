import type { AuthDataSource } from "../../data/data_source/auth_data_source";
import { authService } from "../client/auth_service";

import type {
  LoginCredentials,
  SignupData,
} from "../../domain/types/auth_types";

export class AuthDataSourceImp implements AuthDataSource {
  async login(data: LoginCredentials) {
    return await authService.login(data);
  }

  async register(data: SignupData) {
    return await authService.register(data);
  }
}