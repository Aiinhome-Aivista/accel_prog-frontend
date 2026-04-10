import React, { useState, useEffect } from "react";
import type { CourseHomeOverview, CourseHomeTimelineItem, CourseIntroVideo } from "../../course-learning.models";
import { dashboardService } from "../../../../../services/dashboardService";
import "./HomeTab.css"
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
    <div className="course-container">
      <div className="streak-card">
        <div className="streak-icon">🔥</div>
        <div>
          <h4 className="streak-title">
            {weeklyStreak ? `${weeklyStreak.streak_days}-Day Streak` : (overview?.streak?.text || "0-Day Streak")}
          </h4>
          <p className="streak-sub">
            {weeklyStreak?.streak_days && weeklyStreak.streak_days > 0 ? "You're on fire! Keep it up." : (overview?.streak?.description || "Start learning today!")}
          </p>
        </div>
        <div className="streak-days">
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
                className={`status-box ${
                  isActive
                    ? "active"
                    : "inactive"
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
        <div className="intro-video-wrapper bg-black rounded-[14px] overflow-hidden aspect-video relative group border border-[#E5DDD4] mb-[1rem] flex items-center justify-center">
          <div className="video-overlay-content absolute flex flex-col items-center justify-center pointer-events-none z-10 text-center text-white transition-opacity duration-300 video-overlay">
            <div className="video-play-btn w-[45px] h-[45px] bg-[#E87A2E] rounded-full flex items-center justify-center mb-[0.6rem] shadow-lg">
              <div className="video-play-icon w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-[2px]"></div>
            </div>
            <h3 className="video-title font-['DM_Serif_Display'] text-[1.1rem] md:text-[1.3rem] mb-[0.2rem] drop-shadow-md">
              {introVideo.video_title}
            </h3>
            <p className="video-subtitle text-[0.7rem] md:text-[0.78rem] opacity-90 drop-shadow-md m-0">
              {introVideo.video_subtitle}
            </p>
          </div>
          <div className="video-overlay-bg absolute inset-0 bg-black/40 pointer-events-none z-[5] transition-opacity duration-300 video-overlay"></div>
          
          <video
            key={introVideo.video_path}
            className="video-element w-full h-full object-cover z-0 relative"
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

      <div className="intro-card">
        <div className="intro-content">
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

      <div className="course-stats">
        {[
          [overview?.stats?.weeks || 0, "Weeks"],
          [overview?.stats?.subtopics || 0, "Sub-Topics"],
          [overview?.stats?.questions || 0, "Questions"],
          [overview?.stats?.projects || 0, "Projects"],
        ].map(([n, l], idx) => (
          <div
            key={idx}
            className="stat-box"
          >
            <div
              className="stat-number"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              {n}
            </div>
            <div className="stat-text">
              {l}
            </div>
          </div>
        ))}
      </div>

      <div className="timeline-card">
        <div className="timeline-header">
          <h2
            className="timeline-title"
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
                className="timeline-item "
                onClick={() => goToCourseContent(i)}
              >
                <div
                  className="timeline-dot"
                  style={{
                    backgroundColor: t.status === 'Available' ? (i === 0 ? "#E87A2E" : i === 1 ? "#E8A040" : "#4CAF50") : "#9597A6",
                  }}
                ></div>
                <div className="timeline-text-block">
                  <div className="timeline-text">
                    {t.title}
                  </div>
                  <div className="timeline-subtext">
                    {t.progress} completed ·{" "}
                    {t.status}
                  </div>
                </div>
                <div
                  className={`timeline-badge ${
                    t.status === 'Available'
                      ? "active"
                      : "locked"
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
