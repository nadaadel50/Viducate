// export default LoginPage;
import AuthLayout from '../layouts/AuthLayout';
import { AuthForm } from '../componants/AuthForm';
import LoginPhoto from '../../../../assets/Images/LoginPhoto.png';
import { RightSection } from '../componants/right_section';

const LoginPage = () => {
  return (  
    <AuthLayout 
    RightContent={
      
    <RightSection
    
      titleFirstPart="Turn hours of video "
      titleColoredPart="into minutes of learning."
      description="Master your coursework with AI-powered tools."
      imgSrc={LoginPhoto}
      />}
      LeftContent={<AuthForm type="login" />}

        RightBadge={
        <div className="absolute -right-70 -bottom-70 flex min-w-[180px] animate-bounce items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-[#252836]" style={{ animationDuration: '3s' }}>
       
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 p-1.5 text-green-600">
                <span className="material-symbols-outlined text-sm">check_circle</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">AI Summary</p>
                <p className="text-[10px] text-gray-500">Completed in 2m</p>
              </div>
          
    </div>
          }
    />
    
  );
};
export default LoginPage;