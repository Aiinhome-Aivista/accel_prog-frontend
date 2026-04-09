import React, { useState, useEffect } from "react";
import type { CourseHomeOverview, CourseHomeTimelineItem } from "../../course-learning.models";
import { dashboardService } from "../../../../../services/dashboardService";

import HeroIcon from "../../../../../assets/hero.svg";

interface HomeTabProps {
  goToCourseContent: (weekIndex: number) => void;
  courseId: number;
  userId: number;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  goToCourseContent,
  courseId,
  userId,
}) => {
  const [overview, setOverview] = useState<CourseHomeOverview | null>(null);
  const [timeline, setTimeline] = useState<CourseHomeTimelineItem[]>([]);

  useEffect(() => {
    if (courseId) {
      dashboardService.getCourseHomeOverview(courseId).then((res: any) => {
        if (res.status === 'success' && res.data) setOverview(res.data);
      }).catch((err: any) => console.error("Error fetching overview", err));
    }
    if (courseId && userId) {
      dashboardService.getCourseHomeTimeline(courseId, userId).then((res: any) => {
        if (res.status === 'success' && res.data) setTimeline(res.data);
      }).catch((err: any) => console.error("Error fetching timeline", err));
    }
  }, [courseId, userId]);

  return (
    <div className="max-w-[860px] mx-auto p-[1rem] md:p-[1.3rem_1.8rem_3rem]">
      <div className="bg-white rounded-[14px] border border-[#E5DDD4] p-[0.8rem] mb-[1rem] flex items-center gap-[0.7rem]">
        <div className="text-[1.6rem]">🔥</div>
        <div>
          <h4 className="text-[0.8rem] font-bold text-[#2B2D42] m-0">
            {overview?.streak?.text || "0-Day Streak"}
          </h4>
          <p className="text-[0.68rem] text-[#6B6D7B] m-0">{overview?.streak?.description || "Start learning today!"}</p>
        </div>
        <div className="flex gap-[0.2rem] ml-auto">
          {(overview?.streak?.history || [
            { day: "M", status: "pending" },
            { day: "T", status: "pending" },
            { day: "W", status: "pending" },
            { day: "T", status: "pending" },
            { day: "F", status: "pending" },
            { day: "S", status: "pending" },
            { day: "S", status: "pending" }
          ]).map((s, i) => (
            <div
              key={i}
              className={`w-[17px] h-[17px] rounded-[3px] flex items-center justify-center text-[0.48rem] font-bold ${
                s.status === "completed"
                  ? "bg-[#e87a2e1f] text-[#E87A2E]"
                  : s.status === "current"
                    ? "bg-[#E87A2E] text-white"
                    : "bg-[#F9F5F0] text-[#9597A6]"
              }`}
            >
              {s.day}
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
        <div className="flex items-center gap-4 p-[1rem_1.2rem] text-[0.82rem] text-[#6B6D7B] leading-[1.65]">
            <img
              src={HeroIcon}
              className="h-16 w-16"
              alt="Logo"
              aria-hidden="true"
            />
          <p>
            <strong className="text-[#2B2D42]">Welcome!</strong> {overview?.welcome_text}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-[0.5rem] my-[1rem]">
        {[
          [overview?.stats?.weeks || 0, "Weeks"],
          [overview?.stats?.subtopics || 0, "Sub-Topics"],
          [overview?.stats?.questions || 0, "Questions"],
          [overview?.stats?.projects || 0, "Projects"],
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
          {timeline.map((t, i) => {
            return (
              <div
                key={`t-${i}`}
                className="flex gap-[0.5rem] items-center py-[0.5rem] border-b border-black/5 cursor-pointer last:border-none hover:bg-black/5 transition-colors"
                onClick={() => goToCourseContent(i)}
              >
                <div
                  className="w-[7px] h-[7px] rounded-full shrink-0"
                  style={{
                    backgroundColor: t.status === 'Available' ? (i === 0 ? "#E87A2E" : i === 1 ? "#E8A040" : "#4CAF50") : "#9597A6",
                  }}
                ></div>
                <div className="flex-1">
                  <div className="text-[0.76rem] font-semibold text-[#2B2D42]">
                    {t.title}
                  </div>
                  <div className="text-[0.64rem] text-[#6B6D7B]">
                    {t.progress} completed ·{" "}
                    {t.status}
                  </div>
                </div>
                <div
                  className={`text-[0.6rem] font-semibold px-[0.45rem] py-[0.18rem] rounded-full ${
                    t.status === 'Available'
                      ? "bg-[#e87a2e1f] text-[#E87A2E]"
                      : "bg-[#F9F5F0] text-[#9597A6]"
                  }`}
                >
                  {t.week}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
