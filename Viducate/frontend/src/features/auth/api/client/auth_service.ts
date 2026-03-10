
import {apiClient }from '../../../../core/api/apiClient';

import type { LoginRequestDto } from '../models/login/login_request_dto';
import type { SignupRequestDto } from '../models/signup/signup_request_dto';
console.log("Current Base URL:", import.meta.env.VITE_VIDUCATE_BASE_URL);
export const authService = {
  
  login: async (data: LoginRequestDto) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
  register: async (data: SignupRequestDto) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  
};