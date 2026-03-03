// features/auth/api/client/auth_service.ts
import {apiClient }from '../../../../core/api/apiClient';
import type { LoginCredentials, SignupData } from "../../domain/types/auth_types";

export const authService = {
  login: async (data: LoginCredentials) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
  register: async (data: SignupData) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};