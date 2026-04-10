import React, { useState, useEffect } from "react";
import type { CourseHomeOverview, CourseHomeTimelineItem, CourseIntroVideo } from "../../course-learning.models";
import { dashboardService } from "../../../../../services/dashboardService";

import HeroIcon from "../../../../../assets/hero.svg";

interface HomeTabProps {
  goToCourseContent: (weekIndex: number) => void;
  courseId: number;
  userId: number;
  introVideo?: CourseIntroVideo | null;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  goToCourseContent,
  courseId,
  userId,
  introVideo,
}) => {
  const [overview, setOverview] = useState<CourseHomeOverview | null>(null);
  const [timeline, setTimeline] = useState<CourseHomeTimelineItem[]>([]);
  const [weeklyStreak, setWeeklyStreak] = useState<{ streak_days: number; weekly: any[] } | null>(null);

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
    if (userId) {
      dashboardService.getUserWeeklyStreak(userId).then((res: any) => {
        if (res.status === 'success' && res.data) setWeeklyStreak(res.data);
      }).catch((err: any) => console.error("Error fetching weekly streak", err));
    }
  }, [courseId, userId]);

  return (
    <div className="max-w-[860px] mx-auto p-[1rem] md:p-[1.3rem_1.8rem_3rem]">
      <div className="bg-white rounded-[14px] border border-[#E5DDD4] p-[0.8rem] mb-[1rem] flex items-center gap-[0.7rem]">
        <div className="text-[1.6rem]">🔥</div>
        <div>
          <h4 className="text-[0.8rem] font-bold text-[#2B2D42] m-0">
            {weeklyStreak ? `${weeklyStreak.streak_days}-Day Streak` : (overview?.streak?.text || "0-Day Streak")}
          </h4>
          <p className="text-[0.68rem] text-[#6B6D7B] m-0">
            {weeklyStreak?.streak_days && weeklyStreak.streak_days > 0 ? "You're on fire! Keep it up." : (overview?.streak?.description || "Start learning today!")}
          </p>
        </div>
        <div className="flex gap-[0.2rem] ml-auto">
          {(weeklyStreak?.weekly || overview?.streak?.history || [
            { day: "M", status: "pending" },
            { day: "T", status: "pending" },
            { day: "W", status: "pending" },
            { day: "T", status: "pending" },
            { day: "F", status: "pending" },
            { day: "S", status: "pending" },
            { day: "S", status: "pending" }
          ]).map((s, i) => {
            // Map API response to UI status
            const isActive = s.is_active || s.status === "completed" || s.status === "current";
            return (
              <div
                key={i}
                className={`w-[19px] h-[19px] rounded-[4px] flex items-center justify-center text-[0.55rem] font-bold transition-all ${
                  isActive
                    ? "bg-[#E87A2E] text-white"
                    : "bg-[#F9F5F0] text-[#9597A6]"
                }`}
                title={s.date}
              >
                {s.day.charAt(0)}
              </div>
            );
          })}
        </div>
      </div>

      {introVideo && (
        <div className="bg-black rounded-[14px] overflow-hidden aspect-video relative group border border-[#E5DDD4] mb-[1rem] flex items-center justify-center">
          <div className="absolute flex flex-col items-center justify-center pointer-events-none z-10 text-center text-white transition-opacity duration-300 video-overlay">
            <div className="w-[45px] h-[45px] bg-[#E87A2E] rounded-full flex items-center justify-center mb-[0.6rem] shadow-lg">
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-[2px]"></div>
            </div>
            <h3 className="font-['DM_Serif_Display'] text-[1.1rem] md:text-[1.3rem] mb-[0.2rem] drop-shadow-md">
              {introVideo.video_title}
            </h3>
            <p className="text-[0.7rem] md:text-[0.78rem] opacity-90 drop-shadow-md m-0">
              {introVideo.video_subtitle}
            </p>
          </div>
          <div className="absolute inset-0 bg-black/40 pointer-events-none z-[5] transition-opacity duration-300 video-overlay"></div>
          
          <video
            key={introVideo.video_path}
            className="w-full h-full object-cover z-0 relative"
            src={introVideo.video_path}
            controls={true}
            onPlay={(e) => {
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const overlays = parent.querySelectorAll('.video-overlay');
                overlays.forEach(n => ((n as HTMLElement).style.opacity = '0'));
              }
            }}
            onPause={(e) => {
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const overlays = parent.querySelectorAll('.video-overlay');
                overlays.forEach(n => ((n as HTMLElement).style.opacity = '1'));
              }
            }}
          ></video>
        </div>
      )}

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
