import React from 'react';
import { ANN } from '../../course-learning.data';

export const AnnouncementsTab: React.FC = () => {
  return (
    <div className="learning-tab-container">
      <h2 className="std-section-title mb-[1.2rem]">Announcements</h2>
      {ANN.map((a, i) => (
        <div key={i} className="std-card p-[0.7rem_0.9rem] mb-[0.4rem] flex gap-[0.5rem] border-radius-[8px]">
          <div className="w-[30px] h-[30px] rounded-[7px] bg-[#e87a2e1f] flex items-center justify-center shrink-0 text-[0.85rem]">
            📢
          </div>
          <div>
            <h4 className="text-[0.76rem] font-bold text-[#2B2D42] mb-[0.08rem]">{a.t}</h4>
            <p className="text-[0.7rem] text-[#6B6D7B] leading-[1.45] m-0">{a.tx}</p>
            <div className="text-[0.58rem] text-[#9597A6] mt-[0.15rem]">{a.tm}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
