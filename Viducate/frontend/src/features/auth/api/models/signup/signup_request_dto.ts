/**
 * ده الـ Object اللي بنبعته للـ API في الـ Body
 * لازم الحقول تطابق الـ UserRegisterRequest في الـ FastAPI
 */
import type { UserDto } from '../user_dto';
export interface SignupRequestDto {
  full_name: string;   // الـ API غالباً بيستخدم snake_case 
  email: string;
  password: string;
}

/**
 * ده شكل الـ Response اللي راجع من الـ API (RegisterResponse)
 * زي ما هو مكتوب عندك في الـ Python Code
 */
export interface SignupResponseDto {
  message: string;
  user: UserDto;
  token: {
    access_token: string;
    token_type: string;
    user: UserDto;
  };
}
