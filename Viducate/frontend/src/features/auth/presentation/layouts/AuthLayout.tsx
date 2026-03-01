type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen flex">

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8">

        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>

          {subtitle && (
            <p className="text-gray-500 mt-2 mb-8">{subtitle}</p>
          )}

          {children}
        </div>

      </div>

      {/* Right Side - Gradient + Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] items-center justify-center">

        <div className="text-white text-center px-10">
          <h2 className="text-4xl font-bold mb-4">
            Viducate
          </h2>
          <p className="opacity-90">
            Smart learning experience powered by AI
          </p>

          {/* تقدري تحطي صورة هنا */}
          {/* <img src="/assets/Images/auth-illustration.svg" /> */}
        </div>

      </div>

    </div>
  );
}