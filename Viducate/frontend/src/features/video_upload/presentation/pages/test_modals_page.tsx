import React, { useState } from 'react';
import { LanguageInitModal } from '../componants/LanguageInitModal';
import { CustomizeExperienceModal } from '../componants/CustomizeExperienceModal';

const TestModalsPage: React.FC = () => {
  // حالة فتح وإغلاق المودال الصغير (البداية)
  const [isInitOpen, setIsInitOpen] = useState(false);
  
  // حالة فتح وإغلاق المودال الكبير (التخصيص)
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // دالة للانتقال من المودال الصغير للكبير (زي ما اليوزر هيعمل بالظبط)
  const handleGoToCustomize = () => {
    setIsInitOpen(false); // نقفل الصغير
    setTimeout(() => {
      setIsCustomizeOpen(true); // نفتح الكبير بعد ثانية بسيطة عشان الأنميشن
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      {/* هيدر بسيط للصفحة */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          ViduCate Components Lab 🧪
        </h1>
        <p className="text-gray-500 text-lg">
          اختبار الـ Modals الخاصة بـ Video Upload Language Preferences
        </p>
      </div>

      {/* أزرار التحكم في فتح المودالز */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
          <p className="text-sm text-gray-400 mb-4 font-medium uppercase">Step 1: Confirmation</p>
          <button 
            onClick={() => setIsInitOpen(true)}
            className="w-full bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transition-all active:scale-95"
          >
            Open Language Init Modal
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
          <p className="text-sm text-gray-400 mb-4 font-medium uppercase">Step 2: Full Settings</p>
          <button 
            onClick={() => setIsCustomizeOpen(true)}
            className="w-full bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-95"
          >
            Open Customize Modal
          </button>
        </div>
      </div>

      {/* تعليمات بسيطة تحت الأزرار */}
      <div className="mt-12 text-gray-400 text-sm">
        <p>ملاحظة: تأكدي من وجود <b>BaseModal</b> في الـ Core لكي تعمل هذه المودالات.</p>
      </div>

      {/* 1. المودال الصغير: يظهر كأنه يسأل المستخدم أولاً */}
      <LanguageInitModal 
        isOpen={isInitOpen} 
        onClose={() => setIsInitOpen(false)} 
        onCustomize={handleGoToCustomize} 
      />

      {/* 2. المودال الكبير: يظهر لتحديد اللغات بالتفصيل */}
      <CustomizeExperienceModal 
        isOpen={isCustomizeOpen} 
        onClose={() => setIsCustomizeOpen(false)} 
      />
    </div>
  );
};

export default TestModalsPage;