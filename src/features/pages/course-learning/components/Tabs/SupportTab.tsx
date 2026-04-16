import React from 'react';
import { useToast } from '../../../../../utils/ToastContext';
import './SupportTab.css';

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
            <div className="support-card-body">
              <div className="support-icon">{ic}</div>
              <h4 className="support-card-title">{t}</h4>
              <p className="support-card-description">{d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
