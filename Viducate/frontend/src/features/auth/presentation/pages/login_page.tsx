
// // import React from 'react';
// // import AuthLayout from '../layouts/AuthLayout';
// // import  AuthMainText  from '../../../../core/componants/auth_text_section';
// // const LoginPage: React.FC = () => {
// //   return (
// //     <AuthLayout 
    
// //       title="Turn hours of video into minutes of learning"
// //       description="Master your coursework with AI-powered video insights."
// //       imageSrc="../../../../assets/Images/LoginPhoto.png" 
// //       LeftContent={ <div>
// //       <AuthMainText
// //         bigTitle="Turn hours of video into minutes of learning"
// //         smallTitle="Master your coursework with AI-powered video insights."
// //       />
// //       <p>هنا ممكن تحطي </p>
// //     </div>
// //   }
// //     >
  
// //     </AuthLayout>

// //   );
// // };

// // export default LoginPage;
// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import AuthLayout from '../layouts/AuthLayout';
// import { AuthMainText } from '../../../../core/componants/auth_text_section';
// import { CustomInput } from '../../../../core/componants/custom_input';
// import { CustomButton } from '../../../../core/componants/custum_btn';
// import LoginPhoto from '../../../../assets/Images/LoginPhoto.png';
// import GoogleIcon from '../../../../assets/Images/Google.png';

// // 1. تعريف الـ Schema للـ Validation
// const loginSchema = z.object({
//   email: z.string().email("البريد الإلكتروني غير صحيح"),
//   password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
// });

// type LoginFormValues = z.infer<typeof loginSchema>;

// const LoginPage = () => {
//   const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: { email: '', password: '' }
//   });

//   const onSubmit = (data: LoginFormValues) => {
//     console.log("Login Data:", data);
//     // هنا هننادي الـ UseCase بتاع الـ Login
//     // loginUseCase.execute(data);
//   };

//   return (
//     <AuthLayout
//       title="Turn hours of video into minutes of learning."
//       description="Master your coursework with AI-powered video insights and interactive study tools."
//       imageSrc={LoginPhoto}
//       LeftContent={
//         <div className="space-y-6">
//           <AuthMainText 
//             bigTitle="Welcome back" 
//             smallTitle="Enter your details to access your study library." 
//           />
          
//           <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 py-3 font-semibold transition hover:bg-gray-50">
//             <img src={GoogleIcon} alt="Google" className="w-5" />
//             Log in with Google
//           </button>

//           <div className="relative flex items-center py-2">
//             <div className="flex-grow border-t border-gray-200"></div>
//             <span className="mx-4 flex-shrink text-xs font-bold text-gray-400 uppercase">OR</span>
//             <div className="flex-grow border-t border-gray-200"></div>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
//             <CustomInput
//               label="Email address"
//               placeholder="student@university.edu"
//               value={watch('email')}
//               onChange={(e) => setValue('email', e.target.value)}
//               error={errors.email?.message}
//             />
            
//             <CustomInput
//               label="Password"
//               type="password"
//               placeholder="Enter your password"
//               value={watch('password')}
//               onChange={(e) => setValue('password', e.target.value)}
//               error={errors.password?.message}
//             />

//             <div className="flex items-center justify-between pb-4">
//               <label className="flex items-center gap-2 text-sm font-medium">
//                 <input type="checkbox" className="rounded border-gray-300" />
//                 Remember me
//               </label>
//               <a href="#" className="text-sm font-bold text-blue-600 hover:underline">Forgot password?</a>
//             </div>

//             <CustomButton type="submit">Log In</CustomButton>
//           </form>

//           <p className="text-center text-sm">
//             Don't have an account? <a href="/signup" className="font-bold text-blue-600">Sign up</a>
//           </p>
//         </div>
//       }
//     />
//   );
// };

// export default LoginPage;
import AuthLayout from '../layouts/AuthLayout';
import { AuthForm } from '../componants/AuthForm';
import LoginPhoto from '../../../../assets/Images/LoginPhoto.png';

const LoginPage = () => {
  const handleLogin = (data: any) => console.log("Login API Call:", data);

  return (
    <AuthLayout 
      title="Turn hours of video into minutes of learning."
      description="Master your coursework with AI-powered tools."
      imageSrc={LoginPhoto}
      LeftContent={<AuthForm type="login" onSubmit={handleLogin} />}
    />
  );
};
export default LoginPage;