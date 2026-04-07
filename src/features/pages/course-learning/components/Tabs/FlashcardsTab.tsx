import React, { useState } from 'react';
import { FC } from '../../course-learning.data';

export const FlashcardsTab: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const toggleFlip = (idx: number) => {
    setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="max-w-[860px] mx-auto p-[1rem] md:p-[1.3rem_1.8rem_3rem]">
      <div className="font-['DM_Serif_Display'] text-[1.3rem] text-[#2B2D42] mb-[1.2rem]">Flashcards</div>
      <p className="text-[0.74rem] text-[#6B6D7B] mt-[-0.8rem] mb-[0.6rem]">Click to flip. Practice daily.</p>
      
      <div className="flex gap-[0.5rem] overflow-x-auto py-[0.3rem] mb-[0.8rem] scrollbar-hide">
        {FC.map((f, i) => {
          const isFlipped = flippedCards[i] || false;
          return (
            <div 
              key={i} 
              className="min-w-[170px] h-[100px] rounded-[8px] bg-transparent cursor-pointer shrink-0 [perspective:600px]"
              onClick={() => toggleFlip(i)}
            >
              <div 
                className={`w-full h-full relative transition-[transform] duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
              >
                <div className="absolute inset-0 [backface-visibility:hidden] flex items-center justify-center p-[0.6rem] text-center rounded-[8px] bg-[#F9F5F0] text-[0.73rem] font-semibold text-[#2B2D42] border border-[#E5DDD4]">
                  {f.q}
                </div>
                <div className="absolute inset-0 [backface-visibility:hidden] flex items-center justify-center p-[0.6rem] text-center rounded-[8px] bg-[#e87a2e1f] text-[0.7rem] text-[#D06A20] border border-[#E5DDD4] [transform:rotateY(180deg)] leading-[1.4]">
                  {f.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
