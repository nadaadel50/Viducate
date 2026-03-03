

// export default SignupPage;
import React from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { AuthForm } from '../componants/AuthForm';
import {RightSection }from '../componants/right_section';
// استيراد الصورة الخاصة بالساين أب
import signUpPhoto from '../../../../assets/Images/signUpPhoto.jpeg';

const SignupPage: React.FC = () => {
  return (
    <AuthLayout
      RightContent={<RightSection 
      titleFirstPart="Turn hours of video "
      titleColoredPart="into minutes of insight."
      description="Viducate helps you learn faster with AI-powered summaries and quizzes generated directly from your course materials."
      imgSrc={signUpPhoto}
      />}
      
      LeftContent={
        <AuthForm 
          type="signup" 
        />
      }
      RightBadge={
        <div className="absolute -right-70 -top-0 flex min-w-[180px] animate-bounce items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-[#252836]" style={{ animationDuration: '3s' }}>
       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 p-1.5 text-green-600">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Quiz Score</p>
              <p className="text-lg font-bold text-[#111218] dark:text-white">98%</p>
            </div>
          
    </div>
          }
    />
  );
};

export default SignupPage;