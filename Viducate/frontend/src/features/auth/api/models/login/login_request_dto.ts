/** * 1. الـ Request: البيانات اللي بنبعتها للباك
 * لازم تكون مطابقة للـ UserLoginRequest في كود الـ Python
 */
import type { UserDto } from '../user_dto';
export interface LoginRequestDto {
  email: string;
  password: string;
}

/** * 2. الـ Response: البيانات اللي بترجع من الباك
 * مطابقة للـ TokenResponse في كود الـ Python
 */
export interface LoginResponseDto {
  access_token: string;
  token_type: string;
  user: UserDto;
}