import React from 'react';

export const SupportTab: React.FC = () => {
  return (
    <div className="max-w-[860px] mx-auto p-[1rem] md:p-[1.3rem_1.8rem_3rem]">
      <div className="font-['DM_Serif_Display'] text-[1.3rem] text-[#2B2D42] mb-[1.2rem]">Support</div>
      <div className="grid grid-cols-2 gap-[0.6rem]">
        {[
          ['💬', 'Live Chat', 'Real-time help.'],
          ['📧', 'Email', 'Response in 24h.'],
          ['❓', 'FAQs', 'Common questions.'],
          ['📅', 'Office Hours', 'Book 1:1 time.']
        ].map(([ic, t, d], idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-[14px] border border-[#E5DDD4] cursor-pointer transition-shadow hover:shadow-[0_8px_24px_rgba(43,45,66,0.08)]"
            onClick={() => alert(`${t} — coming soon!`)}
          >
            <div className="p-[1rem] text-center">
              <div className="text-[1.3rem] mb-[0.25rem]">{ic}</div>
              <h4 className="text-[0.8rem] font-bold text-[#2B2D42] mb-[0.08rem] m-0">{t}</h4>
              <p className="text-[0.7rem] text-[#6B6D7B] m-0">{d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
