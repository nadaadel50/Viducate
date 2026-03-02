// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { Link } from 'react-router-dom'; // أو حسب مكتبة الـ routing عندك

// import AuthLayout from '../layouts/AuthLayout';
// import { AuthMainText } from '../../../../core/componants/auth_text_section';
// import { CustomInput } from '../../../../core/componants/custom_input';
// import { CustomButton } from '../../../../core/componants/custum_btn';

// // استيراد الصور من الـ assets حسب المسار في مشروعك
// import signUpPhoto from '../../../../assets/Images/signUpPhoto.png';
// import GoogleIcon from '../../../../assets/Images/Google.png';

// // 1. تعريف الـ Validation Schema باستخدام Zod
// const signupSchema = z.object({
//   fullName: z.string().min(3, "Full name must be at least 3 characters"),
//   email: z.string().email("Please enter a valid email address"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
//   confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"], // الـ error هيظهر عند حقل تأكيد كلمة المرور
// });

// // استخراج الـ Type من الـ Schema
// type SignupFormValues = z.infer<typeof signupSchema>;

// const SignupPage: React.FC = () => {
//   // 2. إعداد الـ Form Hook
//   const {
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors, isValid }
//   } = useForm<SignupFormValues>({
//     resolver: zodResolver(signupSchema),
//     mode: "onChange", // عشان الـ validation يشتغل وأنتِ بتكتبي
//     defaultValues: {
//       fullName: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//     }
//   });

//   // 3. دالة الإرسال (Submit)
//   const onSubmit = (data: SignupFormValues) => {
//     console.log("Signup Data Ready for API:", data);
//     // هنا مستقبلاً هننادي الـ UseCase:
//     // signupUseCase.execute(data);
//   };

//   // مراقبة القيم عشان نبعتها للـ CustomInput
//   const formValues = watch();

//   return (
//     <AuthLayout
//       title="Turn hours of video into minutes of insight."
//       description="Viducate helps you learn faster with AI-powered summaries and quizzes generated directly from your course materials."
//       imageSrc={signUpPhoto}
//       LeftContent={
//         <div className="space-y-4">
//           <div className="mb-2">
//              <h1 className="text-3xl font-black mb-2">Create your account</h1>
//              <p className="text-gray-500 text-sm">Unlock the power of AI to master your study materials.</p>
//           </div>

//           {/* Google Sign Up */}
//           <button 
//             type="button"
//             className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-100 py-3 font-semibold transition hover:bg-gray-50 active:scale-[0.98]"
//           >
//             <img src={GoogleIcon} alt="Google" className="w-5" />
//             Sign up with Google
//           </button>

//           <div className="relative flex items-center py-2">
//             <div className="flex-grow border-t border-gray-100"></div>
//             <span className="mx-4 flex-shrink text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//               Or continue with email
//             </span>
//             <div className="flex-grow border-t border-gray-100"></div>
//           </div>

//           {/* Signup Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
//             <CustomInput
//               label="Full Name"
//               placeholder="Alex Johnson"
//               value={formValues.fullName}
//               onChange={(e) => setValue('fullName', e.target.value, { shouldValidate: true })}
//               error={errors.fullName?.message}
//             />

//             <CustomInput
//               label="Email Address"
//               placeholder="alex.j@example.com"
//               value={formValues.email}
//               onChange={(e) => setValue('email', e.target.value, { shouldValidate: true })}
//               error={errors.email?.message}
//             />

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <CustomInput
//                 label="Password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={formValues.password}
//                 onChange={(e) => setValue('password', e.target.value, { shouldValidate: true })}
//                 error={errors.password?.message}
//               />
//               <CustomInput
//                 label="Confirm Password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={formValues.confirmPassword}
//                 onChange={(e) => setValue('confirmPassword', e.target.value, { shouldValidate: true })}
//                 error={errors.confirmPassword?.message}
//               />
//             </div>

//             <div className="flex items-start gap-3 py-4">
//               <input 
//                 id="terms" 
//                 type="checkbox" 
//                 className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
//                 required
//               />
//               <label htmlFor="terms" className="text-xs text-gray-500 leading-snug">
//                 I agree to the <span className="text-blue-600 font-semibold cursor-pointer">Terms of Service</span> and <span className="text-blue-600 font-semibold cursor-pointer">Privacy Policy</span>.
//               </label>
//             </div>

//             <CustomButton 
//               type="submit" 
//               // disabled={!isValid} // اختياري: تعطيل الزرار لو الـ form مش valid
//             >
//               Start Learning →
//             </CustomButton>
//           </form>

//           <p className="text-center text-sm text-gray-600 pt-2">
//             Already have an account? <Link to="/login" className="font-bold text-blue-600 hover:underline">Log in</Link>
//           </p>

//           <div className="flex justify-center gap-6 pt-4 text-[10px] text-gray-400 font-medium">
//             <a href="#" className="hover:text-gray-600">Help Center</a>
//             <span>•</span>
//             <a href="#" className="hover:text-gray-600">Contact Support</a>
//           </div>
//         </div>
//       }
//     />
//   );
// };

// export default SignupPage;
import React from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { AuthForm } from '../componants/AuthForm';

// استيراد الصورة الخاصة بالساين أب
import signUpPhoto from '../../../../assets/Images/signUpPhoto.png';

const SignupPage: React.FC = () => {
  
  // الدالة دي اللي هتتنفذ لما الفورم تخلص فالديشن وتدوس "Start Learning"
  const handleSignupSubmit = (data: any) => {
    console.log("البيانات جاهزة نبعتها للـ API:", data);
    
    // مستقبلاً هنا هننادي الـ UseCase
    // signupUseCase.execute({
    //   email: data.email,
    //   password: data.password,
    //   fullName: data.fullName
    // });
  };

  return (
    <AuthLayout
      // البيانات اللي بتظهر في الجزء اليمين (الصورة والكلام)
      title="Turn hours of video into minutes of insight."
      description="Viducate helps you learn faster with AI-powered summaries and quizzes generated directly from your course materials."
      imageSrc={signUpPhoto}
      
      // بنستدعي الـ Component المشترك ونحدد النوع 'signup'
      LeftContent={
        <AuthForm 
          type="signup" 
          onSubmit={handleSignupSubmit} 
        />
      }
    />
  );
};

export default SignupPage;