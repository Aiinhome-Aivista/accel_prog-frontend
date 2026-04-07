import React from 'react';
import { WK } from '../../course-learning.data';

export const GradesTab: React.FC<{ done: Set<string> }> = ({ done }) => {
  const totalSubs = WK.reduce((a, w) => a + w.subs.length, 0);
  const pct = Math.round((done.size / totalSubs) * 100) || 0;

  return (
    <div className="max-w-[860px] mx-auto p-[1rem] md:p-[1.3rem_1.8rem_3rem]">
      <div className="font-['DM_Serif_Display'] text-[1.3rem] text-[#2B2D42] mb-[1.2rem]">Your Grades & Performance</div>
      
      <div className="grid grid-cols-3 md:grid-cols-5 gap-[0.5rem] mb-[1rem]">
        {[
          [`${pct}%`, 'Progress', '#E87A2E'],
          [`${done.size}/${totalSubs}`, 'Done', '#4CAF50'],
          ['78%', 'Avg Score', '#4285F4'],
          ['5', 'Streak', '#FF6B35'],
          ['#3', 'Rank', '#9C27B0']
        ].map(([v, l, c], idx) => (
          <div key={idx} className="bg-white rounded-[8px] border border-[#E5DDD4] p-[0.6rem] text-center">
            <div className="font-['DM_Serif_Display'] text-[1.1rem]" style={{ color: c }}>{v}</div>
            <div className="text-[0.58rem] text-[#9597A6] uppercase tracking-[0.04em] font-semibold">{l}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[14px] border border-[#E5DDD4] overflow-hidden mb-[1rem]">
        <div className="p-[1rem_1.2rem] border-b border-[#E5DDD4] flex items-center justify-between">
          <h2 className="font-['DM_Serif_Display'] text-[0.95rem] text-[#2B2D42] m-0">Competency</h2>
        </div>
        <div className="p-[1rem_1.2rem]">
          <div className="grid grid-cols-3 gap-[0.5rem]">
            {[
              ['Critical Thinking', 78, '#9C27B0'],
              ['Technical Depth', 72, '#4285F4'],
              ['Problem Solving', 82, '#E87A2E'],
              ['Communication', 85, '#4CAF50'],
              ['Creativity', 88, '#FF6B35'],
              ['Collaboration', 90, '#00BCD4']
            ].map(([l, v, c], idx) => (
              <div key={idx} className="bg-[#F9F5F0] rounded-[8px] p-[0.6rem] text-center">
                <div className="w-[56px] h-[56px] mx-auto mb-[0.3rem] relative">
                  <svg viewBox="0 0 56 56" className="w-[56px] h-[56px] origin-center -rotate-90">
                    <circle cx="28" cy="28" r="24" className="fill-none stroke-[#E5DDD4] stroke-[5px] object-center mix-blend-normal" />
                    <circle 
                      cx="28" cy="28" r="24" 
                      fill="none" 
                      stroke={c as string} 
                      strokeWidth="5" 
                      strokeLinecap="round" 
                      strokeDasharray={2 * Math.PI * 24} 
                      strokeDashoffset={2 * Math.PI * 24 * (1 - (v as number) / 100)} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-['DM_Serif_Display'] text-[0.78rem] text-[#2B2D42]">
                    {v}%
                  </div>
                </div>
                <div className="text-[0.63rem] text-[#6B6D7B] font-medium">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {WK.map((w, i) => {
        const sc = { Reading: 88, Video: 92, Assessment: 76, Discussion: 85, Project: 72 };
        const avg = i === 0 ? Math.round(Object.values(sc).reduce((a, b) => a + b) / 5) : 0;
        
        return (
          <div key={i} className="bg-white rounded-[14px] border border-[#E5DDD4] mb-[0.7rem] overflow-hidden">
            <div className="p-[0.7rem_0.9rem] border-b border-[#E5DDD4] flex items-center justify-between">
              <h4 className="text-[0.78rem] font-bold text-[#2B2D42] m-0">{w.short}: {w.t}</h4>
              <div className={`font-['DM_Serif_Display'] text-[0.9rem] ${avg ? 'text-[#4CAF50]' : 'text-[#9597A6]'}`}>
                {avg || '—'}{avg ? '%' : ''}
              </div>
            </div>
            <div className="p-[0.6rem_0.9rem]">
              {Object.entries(sc).map(([k, v], vIdx) => (
                <div key={vIdx} className="flex justify-between py-[0.25rem] text-[0.7rem] text-[#6B6D7B] border-b border-black/5 last:border-none">
                  <span>{k}</span>
                  <span className="font-semibold">{i === 0 ? `${v}%` : '—'}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
