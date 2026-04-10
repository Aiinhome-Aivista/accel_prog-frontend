import React from "react";
import type { WeekData } from "../../course-learning.models";
import "./HomeTab.css";
import HeroIcon from "../../../../../assets/hero.svg";

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
    <div className="course-container">
      <div className="streak-card">
        <div className="streak-icon">🔥</div>
        <div>
          <h4 className="streak-title">
            5-Day Streak!
          </h4>
          <p className="streak-sub">Keep going.</p>
        </div>
        <div className="streak-days">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div
              key={i}
              className={`day-box ${
                i < 5
                  ? "done"
                  : i === 5
                    ? "today"
                    : "pending"
              }`}
            >
              {d}
            </div>
          ))}
        </div>
      </div>

      <div className="video-wrapper group">
        <video
          className="video-element"
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          controls={true}
        ></video>
      </div>

      <div className="intro-card">
        <div className="intro-content">
            <img
              src={HeroIcon}
              className="h-16 w-16"
              alt="Logo"
              aria-hidden="true"
            />
          <p>
            <strong className="text-[#2B2D42]">Welcome!</strong> Master prompt
            engineering, multimodal AI, Python automation, and responsible AI
            practices across 4 intensive weeks. Each sub-topic must be completed
            before the next unlocks — building deep, sequential mastery.
          </p>
        </div>
      </div>

      <div className="course-stats">
        {[
          ["4", "Weeks"],
          ["28", "Sub-Topics"],
          ["32", "Questions"],
          ["4", "Projects"],
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
        <div className="timeline-body">
          {weeks.map((w, i) => {
            const isWeekComplete = w.subs.every((s) => done.has(s.id));
            const doneCt = w.subs.filter((s) => done.has(s.id)).length;

            return (
              <div
                key={i}
                className="timeline-item"
                onClick={() => goToCourseContent(i)}
              >
                <div
                  className="timeline-dot"
                  style={{
                    backgroundColor: isWeekComplete ? "#4CAF50" : w.color,
                  }}
                ></div>
                <div className="flex-1">
                  <div className="timeline-text">
                    {w.t}
                  </div>
                  <div className="timeline-subtext">
                    {doneCt}/{w.subs.length} completed ·{" "}
                    {w.ul ? "Available" : "Locked"}
                  </div>
                </div>
                <div
                  className={`timeline-badge ${
                    w.ul
                      ? "active"
                      : "locked"
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
