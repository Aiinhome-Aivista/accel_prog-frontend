import React from 'react';
import { PP } from '../../course-learning.data';

export const PeopleTab: React.FC = () => {
  return (
    <div className="max-w-[860px] mx-auto p-[1rem] md:p-[1.3rem_1.8rem_3rem]">
      <div className="font-['DM_Serif_Display'] text-[1.3rem] text-[#2B2D42] mb-[1.2rem]">People & Cohort</div>
      
      <div className="flex items-center gap-[0.4rem] mb-[0.8rem]">
        <span className="px-[0.5rem] py-[0.18rem] rounded-full text-[0.62rem] font-bold bg-[#e87a2e1f] text-[#E87A2E]">
          Cohort Alpha-3
        </span>
      </div>

      {[
        { title: 'Your Cohort', people: PP.slice(0, 3) },
        { title: 'All', people: PP }
      ].map((section, idx) => (
        <div key={idx} className="bg-white rounded-[14px] border border-[#E5DDD4] overflow-hidden mb-[1rem]">
          <div className="p-[1rem_1.2rem] border-b border-[#E5DDD4] flex items-center justify-between">
            <h2 className="font-['DM_Serif_Display'] text-[0.95rem] text-[#2B2D42] m-0">{section.title}</h2>
          </div>
          <div className="p-[1rem_1.2rem]">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-[0.4rem]">
              {section.people.map((p, pIdx) => (
                <div key={pIdx} className="bg-[#F9F5F0] rounded-[8px] p-[0.6rem] flex items-center gap-[0.4rem]">
                  <div 
                    className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[0.55rem] font-bold shrink-0"
                    style={{ backgroundColor: p.bg, color: p.c }}
                  >
                    {p.a}
                  </div>
                  <div>
                    <div className="text-[0.72rem] font-semibold text-[#2B2D42] leading-[1.2]">{p.n}</div>
                    <div className="text-[0.6rem] text-[#9597A6]">{p.r}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
