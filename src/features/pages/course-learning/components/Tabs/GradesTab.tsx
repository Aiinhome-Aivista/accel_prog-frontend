import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../../../../services/dashboardService';
import type { GradesInfoData } from '../../../dashboard/dashboard.models';

export const GradesTab: React.FC<{ done: Set<string> }> = () => {
  const [gradesData, setGradesData] = useState<GradesInfoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const userStr = localStorage.getItem('user_data');
        if (userStr) {
          const user = JSON.parse(userStr);
          const response = await dashboardService.getGradesInfoByUser(user.id);
          if (response.status === 'success' && response.data) {
            setGradesData(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching grades data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGrades();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E87A2E]"></div>
      </div>
    );
  }

  const kpi = gradesData?.kpi;

  return (
    <div className="max-w-[860px] mx-auto p-[1rem] md:p-[1.3rem_1.8rem_3rem]">
      <div className="font-['DM_Serif_Display'] text-[1.3rem] text-[#2B2D42] mb-[1.2rem]">Your Grades & Performance</div>
      
      <div className="grid grid-cols-3 md:grid-cols-5 gap-[0.5rem] mb-[1rem]">
        {[
          [`${kpi?.progress_percent || 0}%`, 'Progress', '#E87A2E'],
          [`${kpi?.completed || '0/0'}`, 'Done', '#4CAF50'],
          [`${kpi?.avg_score || 0}%`, 'Avg Score', '#4285F4'],
          [`${kpi?.streak_days || 0}`, 'Streak', '#FF6B35'],
          [`#${kpi?.rank || 0}`, 'Rank', '#9C27B0']
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
            {gradesData?.competency?.map((comp, idx) => {
              const colors = ['#9C27B0', '#4285F4', '#E87A2E', '#4CAF50', '#FF6B35', '#00BCD4'];
              const c = colors[idx % colors.length];
              const v = comp.value;
              return (
                <div key={idx} className="bg-[#F9F5F0] rounded-[8px] p-[0.6rem] text-center">
                  <div className="w-[56px] h-[56px] mx-auto mb-[0.3rem] relative">
                    <svg viewBox="0 0 56 56" className="w-[56px] h-[56px] origin-center -rotate-90">
                      <circle cx="28" cy="28" r="24" className="fill-none stroke-[#E5DDD4] stroke-[5px] object-center mix-blend-normal" />
                      <circle 
                        cx="28" cy="28" r="24" 
                        fill="none" 
                        stroke={c} 
                        strokeWidth="5" 
                        strokeLinecap="round" 
                        strokeDasharray={2 * Math.PI * 24} 
                        strokeDashoffset={2 * Math.PI * 24 * (1 - v / 100)} 
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-['DM_Serif_Display'] text-[0.78rem] text-[#2B2D42]">
                      {v}%
                    </div>
                  </div>
                  <div className="text-[0.63rem] text-[#6B6D7B] font-medium">{comp.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {gradesData?.weeks?.map((w, i) => {
        return (
          <div key={i} className="bg-white rounded-[14px] border border-[#E5DDD4] mb-[0.7rem] overflow-hidden">
            <div className="p-[0.7rem_0.9rem] border-b border-[#E5DDD4] flex items-center justify-between">
              <h4 className="text-[0.78rem] font-bold text-[#2B2D42] m-0">{w.week}</h4>
              <div className={`font-['DM_Serif_Display'] text-[0.9rem] ${w.progress ? 'text-[#4CAF50]' : 'text-[#9597A6]'}`}>
                {w.progress || '—'}{w.progress ? '%' : ''}
              </div>
            </div>
            <div className="p-[0.6rem_0.9rem]">
              {w.items.map((item, vIdx) => (
                <div key={vIdx} className="flex justify-between py-[0.25rem] text-[0.7rem] text-[#6B6D7B] border-b border-black/5 last:border-none">
                  <span className="capitalize">{item.name}</span>
                  <span className="font-semibold">{item.value !== null ? `${item.value}%` : '—'}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
