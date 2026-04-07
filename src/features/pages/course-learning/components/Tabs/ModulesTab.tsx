import React, { useState } from "react";
import { WK } from "../../course-learning.data";

export const ModulesTab: React.FC = () => {
  const [openMods, setOpenMods] = useState<Record<number, boolean>>({
    0: true,
  });

  const toggleMod = (idx: number) => {
    setOpenMods((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="max-w-[860px] mx-auto p-[1rem] md:p-[1.3rem_1.8rem_3rem]">
      <div
        className="font-['DM_Serif_Display'] text-[1.3rem] text-[#2B2D42] mb-[1.2rem] font-medium"
        style={{ fontFamily: '"DM Serif Display", serif' }}
      >
        Modules Overview
      </div>
      <p className="text-[0.8rem] text-[#6B6D7B] mt-[-0.8rem] mb-[1rem] leading-[1.5]">
        All topics across 4 weeks. Click to expand day-by-day breakdown.
      </p>

      {WK.map((w, i) => (
        <div
          key={i}
          className="bg-white rounded-[14px] border border-[#E5DDD4] mb-[0.8rem] overflow-hidden"
        >
          <div
            className="p-[0.8rem_1rem] flex items-center gap-[0.5rem] cursor-pointer hover:bg-[#F9F5F0] transition-colors"
            onClick={() => toggleMod(i)}
          >
            <div
              className="w-[24px] h-[24px] rounded-full text-[0.65rem] font-bold flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: w.color }}
            >
              {i + 1}
            </div>
            <h3 className="text-[0.85rem] font-bold text-[#2B2D42] flex-1 m-0">
              {w.t}
            </h3>
            <span className="text-[0.62rem] text-[#9597A6] font-medium">
              {w.short}
              {!w.ul ? " · 🔒" : ""}
            </span>
          </div>

          {openMods[i] && (
            <div className="px-[1rem] pb-[0.8rem]">
              {w.topics.map((tp, idx) => (
                <div
                  key={idx}
                  className="flex gap-[0.4rem] p-[0.35rem_0.5rem] rounded-[8px] bg-[#F9F5F0] mb-[0.25rem] text-[0.74rem] text-[#6B6D7B] leading-[1.4] items-start"
                >
                  <span className="text-[0.62rem] font-bold text-[#E87A2E] shrink-0 min-w-[45px]">
                    {tp.d}
                  </span>
                  <div>
                    <strong className="text-[#2B2D42]">{tp.t}</strong>
                    <br />
                    {tp.n}
                  </div>
                </div>
              ))}
              <div className="mt-[0.5rem] p-[0.5rem_0.7rem] bg-[#e87a2e1f] rounded-[8px] text-[0.72rem] text-[#D06A20]">
                <strong>Project:</strong>{" "}
                {w.subs.find((s) => s.type === "project")?.title || ""}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
