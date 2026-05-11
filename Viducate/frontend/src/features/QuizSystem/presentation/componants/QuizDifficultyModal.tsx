// import { Leaf, Mountain, Zap } from "lucide-react";
// import { BaseModal } from "../../../../core/componants/base_modal";
// import { TopicEndCard } from "../../../../core/componants/topic_ended_card";
// export function QuizDifficultyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
//   return (
// <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
//   <div className="p-10">
//     <div className="text-center mb-10">
       
//        <h2 className="text-3xl font-black text-[#111218]">Select your quiz difficulty level</h2>
//        <p className="text-[#636988] mt-2">Choose a difficulty level that matches your current understanding.</p>
//     </div>

//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       <TopicEndCard 
//     variant="green" 
//     title="Easy" 
//     description="Master the basics" 
//     icon={<Leaf />} 
//   />
//   <TopicEndCard 
//     variant="blue" 
//     title="Intermediate" 
//     description="Build your skills" 
//     icon={<Mountain />} 
//   />
//   <TopicEndCard 
//     variant="red" 
//     title="Hard" 
//     description="Challenge yourself" 
//     icon={<Zap />} 
//   />
//       </div>
//   </div>
// </BaseModal>
// );
// }
import { Leaf, Mountain, Zap } from 'lucide-react';
import { BaseModal } from '../../../../core/componants/base_modal';
import { TopicEndCard } from '../../../../core/componants/topic_ended_card';

type Difficulty = 'easy' | 'medium' | 'hard';

interface QuizDifficultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (difficulty: Difficulty) => void;
}

export function QuizDifficultyModal({ isOpen, onClose, onSelect }: QuizDifficultyModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#111218]">Select your quiz difficulty level</h2>
          <p className="text-[#636988] mt-2">Choose a difficulty level that matches your current understanding.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div onClick={() => onSelect('easy')} className="cursor-pointer">
            <TopicEndCard variant="green" title="Easy" description="Master the basics" icon={<Leaf />} />
          </div>
          <div onClick={() => onSelect('medium')} className="cursor-pointer">
            <TopicEndCard variant="blue" title="Intermediate" description="Build your skills" icon={<Mountain />} />
          </div>
          <div onClick={() => onSelect('hard')} className="cursor-pointer">
            <TopicEndCard variant="red" title="Hard" description="Challenge yourself" icon={<Zap />} />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}