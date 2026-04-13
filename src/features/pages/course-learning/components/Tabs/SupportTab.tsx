import React from 'react';
import { useToast } from '../../../../../utils/ToastContext';

export const SupportTab: React.FC = () => {
  const toast = useToast();

  return (
    <div className="learning-tab-container">
      <h2 className="std-section-title mb-[1.2rem]">Support</h2>
      <div className="grid grid-cols-2 gap-[0.6rem]">
        {[
          ['💬', 'Live Chat', 'Real-time help.'],
          ['📧', 'Email', 'Response in 24h.'],
          ['❓', 'FAQs', 'Common questions.'],
          ['📅', 'Office Hours', 'Book 1:1 time.']
        ].map(([ic, t, d], idx) => (
          <div 
            key={idx} 
            className="std-card std-card-hover cursor-pointer"
            onClick={() => toast.showInfo(`${t} — coming soon!`)}
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
