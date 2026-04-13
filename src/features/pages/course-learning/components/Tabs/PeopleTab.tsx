import React from 'react';
import { PP } from '../../course-learning.data';

export const PeopleTab: React.FC = () => {
  return (
    <div className="learning-tab-container">
      <h2 className="std-section-title mb-[1.2rem]">People & Cohort</h2>
      
      <div className="flex items-center gap-[0.4rem] mb-[0.8rem]">
        <div className="std-badge" style={{ background: "rgba(232, 122, 46, 0.1)", color: "#E87A2E" }}>
          Cohort Alpha-3
        </div>
      </div>

      {[
        { title: 'Your Cohort', people: PP.slice(0, 3) },
        { title: 'All', people: PP }
      ].map((section, idx) => (
        <div key={idx} className="std-card mb-[1rem]">
          <div className="p-[1rem_1.2rem] border-b border-[#E5DDD4] flex items-center justify-between">
            <h3 className="std-section-title text-[0.95rem] m-0">{section.title}</h3>
          </div>
          <div className="p-[1rem_1.2rem]">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-[0.4rem]">
              {section.people.map((p, pIdx) => (
                <div key={pIdx} className="bg-[#F9F5F0] rounded-[8px] p-[0.6rem] flex items-center gap-[0.4rem]">
                  <div 
                    className="std-avatar"
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
