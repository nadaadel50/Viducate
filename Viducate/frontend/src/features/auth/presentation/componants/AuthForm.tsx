import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { CustomInput } from '../../../../core/componants/custom_input';
import { CustomButton } from '../../../../core/componants/custum_btn';
import { AuthMainText } from './auth_text_section';
import GoogleIcon from '../../../../assets/Images/Google.png';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: any) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const isLogin = type === 'login';

  // 1. بناء Schema ديناميكي
  const authSchema = z.object({
    fullName: isLogin ? z.string().optional() : z.string().min(3, "Full name required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password too short"),
    confirmPassword: isLogin ? z.string().optional() : z.string()
  }).refine(data => isLogin || data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  const { handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(authSchema),
    mode: "onChange"
  });

  const formValues = watch();

  return (
    <div className="space-y-4">
      <AuthMainText 
        bigTitle={isLogin ? "Welcome back" : "Create your account"} 
        smallTitle={isLogin ? "Enter your details to access your study library." : "Unlock the power of AI to master your study materials."} 
      />

      <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border-2 py-3 font-semibold hover:bg-gray-50 transition">
        <img src={GoogleIcon} alt="Google" className="w-5" />
        {isLogin ? "Log in with Google" : "Sign up with Google"}
      </button>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-100"></div>
        <span className="mx-4 text-[10px] font-bold text-gray-400 uppercase">OR</span>
        <div className="flex-grow border-t border-gray-100"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {!isLogin && (
          <CustomInput
            label="Full Name"
            placeholder="Alex Johnson"
            value={formValues.fullName || ''}
            onChange={(e) => setValue('fullName', e.target.value, { shouldValidate: true })}
            error={errors.fullName?.message as string}
          />
        )}

        <CustomInput
          label="Email Address"
          placeholder="student@university.edu"
          value={formValues.email || ''}
          onChange={(e) => setValue('email', e.target.value, { shouldValidate: true })}
          error={errors.email?.message as string}
        />

        <div className={isLogin ? "space-y-2" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
          <CustomInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formValues.password || ''}
            onChange={(e) => setValue('password', e.target.value, { shouldValidate: true })}
            error={errors.password?.message as string}
          />
          {!isLogin && (
            <CustomInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={formValues.confirmPassword || ''}
              onChange={(e) => setValue('confirmPassword', e.target.value, { shouldValidate: true })}
              error={errors.confirmPassword?.message as string}
            />
          )}
        </div>

        {isLogin && (
          <div className="flex items-center justify-between pb-2">
            <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" className="rounded" /> Remember me</label>
            <a href="#" className="text-sm font-bold text-blue-600">Forgot password?</a>
          </div>
        )}

        <CustomButton type="submit">
          {isLogin ? "Log In" : "Start Learning →"}
        </CustomButton>
      </form>

      <p className="text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <Link to={isLogin ? "/signup" : "/login"} className="font-bold text-blue-600 ml-1">
          {isLogin ? "Sign up" : "Log in"}
        </Link>
      </p>
    </div>
  );
};