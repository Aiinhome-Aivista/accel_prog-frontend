import React from "react";
import type { WeekData } from "../../course-learning.models";

interface HomeTabProps {
  weeks: WeekData[];
  goToCourseContent: (weekIndex: number) => void;
  done: Set<string>;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  weeks,
  goToCourseContent,
  done,
}) => {
  return (
    <div className="max-w-[860px] mx-auto p-[1rem] md:p-[1.3rem_1.8rem_3rem]">
      <div className="bg-white rounded-[14px] border border-[#E5DDD4] p-[0.8rem] mb-[1rem] flex items-center gap-[0.7rem]">
        <div className="text-[1.6rem]">🔥</div>
        <div>
          <h4 className="text-[0.8rem] font-bold text-[#2B2D42] m-0">
            5-Day Streak!
          </h4>
          <p className="text-[0.68rem] text-[#6B6D7B] m-0">Keep going.</p>
        </div>
        <div className="flex gap-[0.2rem] ml-auto">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div
              key={i}
              className={`w-[17px] h-[17px] rounded-[3px] flex items-center justify-center text-[0.48rem] font-bold ${
                i < 5
                  ? "bg-[#e87a2e1f] text-[#E87A2E]"
                  : i === 5
                    ? "bg-[#E87A2E] text-white"
                    : "bg-[#F9F5F0] text-[#9597A6]"
              }`}
            >
              {d}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black rounded-[14px] overflow-hidden aspect-video relative mb-[0.8rem] group">
        <video
          className="w-full h-full object-cover"
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          controls={true}
        ></video>
      </div>

      <div className="bg-white rounded-[14px] border border-[#E5DDD4] overflow-hidden mb-[1rem]">
        <div className="p-[1rem_1.2rem] text-[0.82rem] text-[#6B6D7B] leading-[1.65]">
          <strong className="text-[#2B2D42]">Welcome!</strong> Master prompt
          engineering, multimodal AI, Python automation, and responsible AI
          practices across 4 intensive weeks. Each sub-topic must be completed
          before the next unlocks — building deep, sequential mastery.
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-[0.5rem] my-[1rem]">
        {[
          ["4", "Weeks"],
          ["28", "Sub-Topics"],
          ["32", "Questions"],
          ["4", "Projects"],
        ].map(([n, l], idx) => (
          <div
            key={idx}
            className="bg-white rounded-[8px] border border-[#E5DDD4] p-[0.7rem] text-center"
          >
            <div
              className="font-['DM_Serif_Display'] text-[1.15rem] text-[#E87A2E]"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              {n}
            </div>
            <div className="text-[0.58rem] text-[#9597A6] uppercase tracking-[0.04em] font-semibold">
              {l}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[14px] border border-[#E5DDD4] overflow-hidden mb-[1rem]">
        <div className="p-[1rem_1.2rem] border-b border-[#E5DDD4] flex items-center justify-between">
          <h2
            className="font-['DM_Serif_Display'] text-[0.95rem] text-[#2B2D42] m-0 font-bold"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Weekly Timeline
          </h2>
        </div>
        <div className="p-[1rem_1.2rem]">
          {weeks.map((w, i) => {
            const isWeekComplete = w.subs.every((s) => done.has(s.id));
            const doneCt = w.subs.filter((s) => done.has(s.id)).length;

            return (
              <div
                key={i}
                className="flex gap-[0.5rem] items-center py-[0.5rem] border-b border-black/5 cursor-pointer last:border-none hover:bg-black/5 transition-colors"
                onClick={() => goToCourseContent(i)}
              >
                <div
                  className="w-[7px] h-[7px] rounded-full shrink-0"
                  style={{
                    backgroundColor: isWeekComplete ? "#4CAF50" : w.color,
                  }}
                ></div>
                <div className="flex-1">
                  <div className="text-[0.76rem] font-semibold text-[#2B2D42]">
                    {w.t}
                  </div>
                  <div className="text-[0.64rem] text-[#6B6D7B]">
                    {doneCt}/{w.subs.length} completed ·{" "}
                    {w.ul ? "Available" : "Locked"}
                  </div>
                </div>
                <div
                  className={`text-[0.6rem] font-semibold px-[0.45rem] py-[0.18rem] rounded-full ${
                    w.ul
                      ? "bg-[#e87a2e1f] text-[#E87A2E]"
                      : "bg-[#F9F5F0] text-[#9597A6]"
                  }`}
                >
                  {w.short}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
