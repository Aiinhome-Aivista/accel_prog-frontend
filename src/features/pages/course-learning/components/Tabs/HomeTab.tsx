import React, { useState, useEffect, useRef } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };


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
      <div className="std-stat-card mb-[1rem]">
        <div className="text-[1.6rem]">🔥</div>
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
        <div 
          className="std-card bg-black aspect-video relative group mb-[1rem] flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="video-overlay-content video-overlay">
            <div className="video-play-btn">
              <div className="video-play-icon"></div>
            </div>
            <h3 className="video-title drop-shadow-md">
              {introVideo.video_title}
            </h3>
            <p className="video-subtitle drop-shadow-md">
              {introVideo.video_subtitle}
            </p>
          </div>
          <div className="video-overlay-bg video-overlay"></div>
          
          <video
            ref={videoRef}
            key={introVideo.video_path}
            className="video-element"
            src={introVideo.video_path}
            controls={true}
            onPlay={(e) => {
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const overlays = parent.querySelectorAll('.video-overlay');
                overlays.forEach(n => ((n as HTMLElement).style.opacity = '0'));
                overlays.forEach(n => ((n as HTMLElement).style.pointerEvents = 'none'));
              }
            }}
            onPause={(e) => {
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const overlays = parent.querySelectorAll('.video-overlay');
                overlays.forEach(n => ((n as HTMLElement).style.opacity = '1'));
                overlays.forEach(n => ((n as HTMLElement).style.pointerEvents = 'auto'));
              }
            }}
          ></video>
        </div>
      )}

      <div className="std-card mb-[1rem]">
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

      <div className="course-stats">
        {[
          [overview?.stats?.weeks || 0, "Weeks"],
          [overview?.stats?.subtopics || 0, "Sub-Topics"],
          [overview?.stats?.questions || 0, "Questions"],
          [overview?.stats?.projects || 0, "Projects"],
        ].map(([n, l], idx) => (
          <div
            key={idx}
            className="std-stat-card border border-[#E5DDD4] p-[0.7rem] text-center flex-col justify-center"
          >
            <div
              className="std-section-title text-[#E87A2E]"
            >
              {n}
            </div>
            <div className="stat-text">
              {l}
            </div>
          </div>
        ))}
      </div>

      <div className="std-card mb-[1rem]">
        <div className="p-[1rem_1.2rem] border-b border-[#E5DDD4] flex items-center justify-between">
          <h2 className="std-section-title m-0">
            Weekly Timeline
          </h2>
        </div>
        <div className="p-[1rem_1.2rem]">
          {timeline.map((t, i) => {
            return (
                <div
                  className={`std-sidebar-item gap-[0.5rem] border-b border-black/5 last:border-none ${t.status === 'Available' ? "hover:bg-black/5" : ""}`}
                  style={{ fontSize: "0.76rem" }}
                  onClick={() => goToCourseContent(i)}
                >
                  <div
                    className="w-[7px] h-[7px] rounded-full shrink-0"
                    style={{
                      backgroundColor: t.status === 'Available' ? (i === 0 ? "#E87A2E" : i === 1 ? "#E8A040" : "#4CAF50") : "#9597A6",
                    }}
                  ></div>
                  <div className="flex-1">
                    <div className="font-semibold text-[#2B2D42]">
                      {t.title}
                    </div>
                    <div className="text-[0.64rem] text-[#6B6D7B]">
                      {t.progress} completed ·{" "}
                      {t.status}
                    </div>
                  </div>
                  <div
                    className="std-badge"
                    style={{ 
                      background: t.status === 'Available' ? "rgba(232, 122, 46, 0.1)" : "#F9F5F0",
                      color: t.status === 'Available' ? "#E87A2E" : "#9597A6",
                      padding: "2px 6px"
                    }}
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
