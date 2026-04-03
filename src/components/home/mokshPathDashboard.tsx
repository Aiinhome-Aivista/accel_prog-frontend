import React from "react";
import "./mokshPathDashboard.css"; // Import the specific CSS file here

interface ProgramCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isComingSoon?: boolean;
  onAction?: () => void;
  colorClass: string;
  cardClass?: string; // ✅ NEW
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  title,
  description,
  icon,
  isComingSoon,
  onAction,
  colorClass,
  cardClass,
}) => (
  <div
    className={`home-card ${cardClass || ""} ${
      isComingSoon ? "coming-soon" : ""
    }`}
    onClick={!isComingSoon ? onAction : undefined}
  >
    {isComingSoon && <div className="home-card-badge">Coming Soon</div>}
    <div className={`home-card-icon ${colorClass}`}>{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
    <span className="home-card-arrow">
      {isComingSoon ? "Notify Me" : "Explore Now"}
      <svg
        viewBox="0 0 14 14"
        fill="none"
        width="14"
        style={{ marginLeft: "8px" }}
      >
        <path
          d="M3 7h8M8 4l3 3-3 3"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  </div>
);

const ProgramSelector: React.FC<{ onSelectAccelerated: () => void }> = ({
  onSelectAccelerated,
}) => {
  return (
    <div className="home-page">
      <nav className="home-nav-fixed">
        <div className="nav-logo-main">
          <svg className="nav-logo-icon-large" viewBox="0 0 42 42" fill="none">
            <circle cx="21" cy="14" r="6" fill="#E87A2E" />
            <path
              d="M21 20c-6 0-10 3-10 7 0 2 1 3 2 4l2-3c1-1.5 2.5-2 3-2h6c.5 0 2 .5 3 2l2 3c1-1 2-2 2-4 0-4-4-7-10-7z"
              fill="#E87A2E"
            />
            <path
              d="M11 31c0 0 2 4 10 4s10-4 10-4"
              stroke="#E87A2E"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <div className="nav-logo-text-stack">
            <span className="nav-logo-name">
              Moksh<span>Path</span>
            </span>
            <span className="nav-logo-tagline">
              Guided Path to True Learning
            </span>
          </div>
        </div>
      </nav>

      <div className="home-hero">
        <div className="home-path-badge">CHOOSE YOUR PATH</div>

        <h1>
          Where Does Your <em>Journey</em> Begin?
        </h1>
        <p className="home-hero-sub">
          Every learner's path is unique. Pick the program that matches your
          ambition and we'll guide the rest.
        </p>

        <div className="home-cards">
          <ProgramCard
            title="Academia"
            description="Semester-long courses, faculty resources, and institutional partnerships for colleges and universities."
            isComingSoon
            colorClass="icon-orange"
            icon={
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M15 3L3 9l12 6 12-6-12-6z" />
                <path d="M6 12v7c0 2 4 4 9 4s9-2 9-4v-7" />
                <path d="M25 9v9" />
              </svg>
            }
          />

          <ProgramCard
            title="Accelerated Program"
            description="Intensive, industry-curated AI courses — from prompt engineering to autonomous agents, built for speed and depth."
            onAction={onSelectAccelerated}
            colorClass="icon-green"
            cardClass="card-green" // ✅ ADD THIS
            icon={
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M16 3l-2 10h8L14 27l2-10H8L16 3z" />
              </svg>
            }
          />

          <ProgramCard
            title="School Olympiad"
            description="Competitive AI challenges, quizzes, and olympiad prep for school students ready to think beyond the textbook."
            isComingSoon
            colorClass="icon-blue"
            icon={
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="15" cy="11" r="6" />
                <path d="M15 17v5m-4 0h8M10 8l-2-4M20 8l2-4M15 5V2" />
              </svg>
            }
          />
        </div>
      </div>
      <footer className="home-footer-middle">
        © 2026 MokshPath – Guided Path to True Learning
      </footer>
    </div>
  );
};

export default ProgramSelector;
