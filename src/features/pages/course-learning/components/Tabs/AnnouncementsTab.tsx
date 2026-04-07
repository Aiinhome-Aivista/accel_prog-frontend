import React from 'react';
import { ANN } from '../../course-learning.data';

export const AnnouncementsTab: React.FC = () => {
  return (
    <div className="max-w-[860px] mx-auto p-[1rem] md:p-[1.3rem_1.8rem_3rem]">
      <div className="font-['DM_Serif_Display'] text-[1.3rem] text-[#2B2D42] mb-[1.2rem]">Announcements</div>
      {ANN.map((a, i) => (
        <div key={i} className="bg-white rounded-[8px] border border-[#E5DDD4] p-[0.7rem_0.9rem] mb-[0.4rem] flex gap-[0.5rem]">
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
