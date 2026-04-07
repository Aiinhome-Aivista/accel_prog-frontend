import React, { useState } from "react";
import LogoIcon from "../../../assets/logogod.svg";
import { useAuth } from "../../../hooks/context/AuthContext";
import { useToast } from "../../../utils/ToastContext";
import { useNavigate } from "react-router-dom";
import dashboardData from "./dashboardData.json";

import type { DashboardData } from "./dashboard.models";

const typedDashboardData = dashboardData as DashboardData;

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState<{
    name: string;
    id: string;
  } | null>(null);

  const openModal = (name: string, id: string) => {
    setActiveCourse({ name, id });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const confirmSub = () => {
    if (activeCourse) {
      showSuccess(
        "Enrollment Successful",
        `You are now enrolled in ${activeCourse.name}.`,
      );
    }
    closeModal();
  };

  return (
    <div className="min-h-screen bg-[#F3EDE7] text-[#2B2D42] font-sans flex flex-col">
      {/* Utility bar */}
      <div className="bg-[#1A1B2E] px-6 py-1.5 flex justify-end gap-5">
        <a
          href="#/programs"
          className="text-white/55 text-[11px] font-medium hover:text-white transition-colors"
        >
          All Programs
        </a>
        <a
          href="#/faqs"
          className="text-white/55 text-[11px] font-medium hover:text-white transition-colors"
        >
          FAQs
        </a>
        <a
          href="#/help"
          className="text-white/55 text-[11px] font-medium hover:text-white transition-colors"
        >
          Help Center
        </a>
      </div>

      {/* Nav */}
      <nav className="bg-white border-b border-[#E5DDD4] px-6 h-[60px] flex items-center justify-between sticky top-0 z-50 shadow-[0_2px_8px_rgba(43,45,66,.06)]">
        <div className="flex items-center gap-6">
          <a className="flex items-center gap-2" href="#/">
            <img
              src={LogoIcon}
              className="w-[30px] h-[30px] object-contain"
              alt="MokshPath Logo"
            />
            <span className="font-serif text-[1.1rem] text-[#2B2D42]">
              Moksh<span className="text-[#E87A2E]">Path</span>
            </span>
          </a>
          <div
            className={`md:flex items-center gap-4 ${navOpen ? "flex absolute top-[60px] left-0 right-0 bg-white border-b border-[#E5DDD4] p-4 flex-col shadow-lg" : "hidden md:flex"}`}
          >
            <a
              href="#/programs"
              className="text-[13px] font-medium text-[#6B6D7B] hover:text-[#E87A2E] hover:bg-[#E87A2E]/10 py-1.5 px-2.5 rounded-md transition-colors"
            >
              Programs
            </a>
            <a
              href="#/"
              className="text-[13px] font-semibold text-[#E87A2E] py-1.5 px-2.5 rounded-md text-center inline-block"
            >
              Dashboard
            </a>
            <a
              href="#myCourses"
              className="text-[13px] font-medium text-[#6B6D7B] hover:text-[#E87A2E] hover:bg-[#E87A2E]/10 py-1.5 px-2.5 rounded-md transition-colors"
            >
              My Courses
            </a>
            <a
              href="#browse"
              className="text-[13px] font-medium text-[#6B6D7B] hover:text-[#E87A2E] hover:bg-[#E87A2E]/10 py-1.5 px-2.5 rounded-md transition-colors"
            >
              Browse
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-[#2B2D42] hidden sm:block">
            {user?.name || "Learner"}
          </span>
          <div
            className="w-[34px] h-[34px] rounded-full bg-[#E87A2E]/10 flex items-center justify-center text-[12px] font-bold text-[#E87A2E] cursor-pointer"
            onClick={onLogout}
            title="Click to Sign Out"
          >
            {user?.name?.[0].toUpperCase() || "L"}
          </div>
          <button
            className="md:hidden p-1 flex flex-col gap-1 cursor-pointer bg-transparent border-none"
            onClick={() => setNavOpen(!navOpen)}
          >
            <span className="block w-[18px] h-[2px] bg-[#2B2D42]"></span>
            <span className="block w-[18px] h-[2px] bg-[#2B2D42]"></span>
            <span className="block w-[18px] h-[2px] bg-[#2B2D42]"></span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-[1060px] w-full mx-auto px-6 py-8 pb-16 flex-1">
        {/* Welcome */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-[clamp(1.4rem,2.5vw,1.8rem)] text-[#2B2D42] mb-1">
              {typedDashboardData.welcome.title}, {user?.name || "Learner"}!
            </h1>
            <p className="text-[13.5px] text-[#6B6D7B] leading-relaxed">
              {typedDashboardData.welcome.streakText}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="px-5 py-2.5 rounded-lg border-none bg-[#E87A2E] hover:bg-[#D06A20] text-white text-[13px] font-semibold transition-colors cursor-pointer"
              onClick={() => navigate("/course-learning", { replace: true })}
            >
              Continue Learning
            </button>
            <button
              className="px-5 py-2.5 rounded-lg bg-white border-[1.5px] border-[#E5DDD4] text-[#6B6D7B] hover:text-[#E87A2E] hover:border-[#E87A2E] text-[13px] font-semibold transition-colors cursor-pointer"
              onClick={() =>
                document
                  .getElementById("browse")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Browse Courses
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
          {typedDashboardData.stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-[14px] border border-[#E5DDD4] p-4 flex items-center gap-3.5 hover:shadow-[0_2px_8px_rgba(43,45,66,.06)] transition-shadow"
            >
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[1.1rem] shrink-0"
                style={{ background: stat.iconBg }}
              >
                {stat.icon}
              </div>
              <div>
                <div className="font-serif text-[1.3rem] text-[#2B2D42]">
                  {stat.value}
                </div>
                <div className="text-[11px] text-[#9597A6] font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* In Progress Courses */}
        <div id="myCourses" className="scroll-mt-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-[1.15rem] text-[#2B2D42]">
              My Courses — In Progress
            </h2>
            <div className="text-[10px] font-bold px-2.5 py-[3px] rounded-full bg-[#E87A2E]/10 text-[#E87A2E]">
              {typedDashboardData.inProgressCourses.length} Active
            </div>
          </div>

          {typedDashboardData.inProgressCourses.length === 0 ? (
            <div className="bg-white rounded-[14px] border border-[#E5DDD4] p-8 text-center mb-10">
              <div className="text-2xl mb-2">📚</div>
              <p className="text-[13px] text-[#9597A6]">
                No courses in progress yet. Browse available courses to start
                learning!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {typedDashboardData.inProgressCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-[14px] border border-[#E5DDD4] overflow-hidden flex flex-col hover:shadow-[0_8px_24px_rgba(43,45,66,.08)] hover:-translate-y-0.5 transition-all cursor-pointer group"
                >
                  <div
                    className="h-2 w-full"
                    style={{ background: course.bannerGradient }}
                  ></div>
                  <div className="p-[1.2rem] flex-1 flex flex-col">
                    <div
                      className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider px-2 py-1 rounded-full mb-2.5 w-fit"
                      style={{
                        background: course.badgeBg,
                        color: course.badgeColor,
                      }}
                    >
                      {course.badge}
                    </div>
                    <div className="font-serif text-[1rem] text-[#2B2D42] mb-1 leading-[1.3]">
                      {course.title}
                    </div>
                    <div className="text-[12px] text-[#6B6D7B] leading-[1.55] flex-1 mb-3">
                      {course.description}
                    </div>
                    <div className="flex gap-3 mb-3 flex-wrap">
                      {course.meta.map((m, i) => (
                        <span
                          key={i}
                          className="text-[10.5px] text-[#9597A6] font-medium flex items-center gap-1"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                    {course.progress !== undefined && (
                      <div className="mb-3">
                        <div className="h-[5px] bg-[#E5DDD4] rounded-[3px] overflow-hidden mb-1">
                          <div
                            className="h-full rounded-[3px] transition-all duration-400"
                            style={{
                              width: `${course.progress}%`,
                              background: course.progressColor,
                            }}
                          ></div>
                        </div>
                        <div className="text-[10.2px] text-[#9597A6] font-medium">
                          {course.progressText}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        className="flex-1 py-[7.5px] px-3 rounded-lg border-none bg-[#E87A2E] hover:bg-[#D06A20] text-white text-[11.8px] font-semibold transition-colors flex items-center justify-center cursor-pointer"
                        onClick={() =>
                          navigate("/course-learning", { replace: true })
                        }
                      >
                        Continue Learning
                      </button>
                      <button
                        className="flex-1 py-[7.5px] px-3 rounded-lg border-[1.5px] border-[#E5DDD4] bg-white text-[#6B6D7B] hover:text-[#E87A2E] hover:border-[#E87A2E] text-[11.8px] font-semibold transition-colors flex items-center justify-center cursor-pointer"
                        onClick={() =>
                          navigate("/course-learning", { replace: true })
                        }
                      >
                        View Grades
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Courses */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-[1.15rem] text-[#2B2D42]">
            Completed Courses
          </h2>
          <div className="text-[10px] font-bold px-2.5 py-[3px] rounded-full bg-[#E8F5E9] text-[#4CAF50]">
            {typedDashboardData.completedCourses.length} Done
          </div>
        </div>

        {typedDashboardData.completedCourses.length === 0 ? (
          <div className="bg-white rounded-[14px] border border-[#E5DDD4] p-8 text-center mb-10">
            <div className="text-2xl mb-2">🎓</div>
            <p className="text-[13px] text-[#9597A6]">
              No completed courses yet. Keep going — your first certificate is
              within reach!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {/* Render completed courses mapped appropriately */}
          </div>
        )}

        {/* Browse More */}
        <div id="browse" className="scroll-mt-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-[1.15rem] text-[#2B2D42]">
              Browse More Courses
            </h2>
            <div className="text-[10px] font-bold px-2.5 py-[3px] rounded-full bg-[rgba(66,133,244,.1)] text-[#4285F4]">
              {typedDashboardData.availableCourses.length} Available
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {typedDashboardData.availableCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-[14px] border border-[#E5DDD4] overflow-hidden flex flex-col hover:shadow-[0_8px_24px_rgba(43,45,66,.08)] hover:-translate-y-0.5 transition-all"
              >
                <div
                  className="h-2 w-full"
                  style={{ background: course.bannerGradient }}
                ></div>
                <div className="p-[1.2rem] flex-1 flex flex-col relative">
                  <div
                    className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider px-2 py-1 rounded-full mb-2.5 w-fit"
                    style={{
                      background: course.badgeBg,
                      color: course.badgeColor,
                    }}
                  >
                    {course.badge}
                  </div>
                  <div className="font-serif text-base text-[#2B2D42] mb-1 leading-[1.3]">
                    {course.title}
                  </div>
                  <div className="text-[12px] text-[#6B6D7B] leading-[1.55] flex-1 mb-3">
                    {course.description}
                  </div>
                  <div className="flex gap-3 mb-3 flex-wrap">
                    {course.meta.map((m, i) => (
                      <span
                        key={i}
                        className="text-[10.5px] text-[#9597A6] font-medium flex items-center gap-1"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1 mb-3 border-t border-[#E0E0E0] pt-3">
                    {course.features?.map((feat, i) => (
                      <div
                        key={i}
                        className="text-[11.2px] text-[#6B6D7B] flex items-center gap-[5px]"
                      >
                        <svg
                          viewBox="0 0 12 12"
                          fill="none"
                          className="w-[12px] h-[12px] text-[#4CAF50] shrink-0"
                        >
                          <path
                            d="M2 6l3 3L10 3"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                        {feat}
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto pt-2">
                    <button
                      className="w-full py-[8.5px] rounded-lg border-none bg-gradient-to-br from-[#E87A2E] to-[#D06A20] text-white text-[12px] font-semibold hover:shadow-[0_4px_16px_rgba(232,122,46,.35)] shadow-[0_2px_10px_rgba(232,122,46,.25)] transition-all flex items-center justify-center cursor-pointer"
                      onClick={() => openModal(course.title, course.id)}
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <h2 className="font-serif text-[1.15rem] text-[#2B2D42]">
            Recent Activity
          </h2>
        </div>
        <div className="bg-white rounded-[14px] border border-[#E5DDD4] overflow-hidden mb-8">
          {typedDashboardData.activities.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-3 p-3.5 hover:bg-[#F9F5F0] transition-colors border-b last:border-b-0 border-[rgba(0,0,0,.04)]"
            >
              <div
                className="w-[32px] h-[32px] rounded-lg flex items-center justify-center text-[13.5px] shrink-0"
                style={{ background: act.iconBg }}
              >
                {act.icon}
              </div>
              <div className="flex-1 mt-0.5">
                <h4 className="text-[12.5px] font-semibold text-[#2B2D42] mb-[2px]">
                  {act.title}
                </h4>
                <p className="text-[11.2px] text-[#6B6D7B] leading-[1.45]">
                  {act.description}
                </p>
              </div>
              <div className="text-[9.5px] text-[#9597A6] shrink-0 ml-auto whitespace-nowrap mt-1">
                {act.time}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1B2E] p-6 text-center shrink-0">
        <p className="text-[11.5px] text-white/40 mb-0">
          &copy; 2026 MokshPath – Guided Path to True Learning
          <a
            href="#/programs"
            className="text-[#E87A2E] ml-2 hover:underline no-underline"
          >
            Programs
          </a>
          <a
            href="#/"
            className="text-[#E87A2E] ml-2 hover:underline no-underline"
          >
            Terms
          </a>
          <a
            href="#/"
            className="text-[#E87A2E] ml-2 hover:underline no-underline"
          >
            Privacy
          </a>
        </p>
      </footer>

      {/* Subscribe Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[14px] p-8 max-w-[400px] w-full text-center shadow-[0_16px_48px_rgba(43,45,66,.12)] relative">
            <button
              className="absolute top-3.5 right-3.5 bg-transparent border-none cursor-pointer text-[#9597A6] text-[1.1rem] hover:text-[#2B2D42] w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              onClick={closeModal}
            >
              ✕
            </button>
            <div className="text-[2rem] mb-[12px] leading-none">🎉</div>
            <h3 className="font-serif text-[1.2rem] text-[#2B2D42] mb-1.5">
              Subscribe to {activeCourse?.name}
            </h3>
            <p className="text-[13px] text-[#6B6D7B] mb-6 leading-[1.5]">
              You're about to enroll in this course. Once subscribed, it will
              appear in your dashboard and you can start learning immediately.
            </p>
            <button
              className="w-full py-[11px] rounded-lg border-none bg-gradient-to-br from-[#E87A2E] to-[#D06A20] text-white text-[13.5px] font-semibold hover:shadow-[0_4px_16px_rgba(232,122,46,.35)] shadow-[0_2px_10px_rgba(232,122,46,.25)] transition-all cursor-pointer"
              onClick={confirmSub}
            >
              Confirm Enrollment
            </button>
            <p className="text-[11px] text-[#9597A6] mt-3 mb-0">
              Free during Summer 2026 pilot program
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
