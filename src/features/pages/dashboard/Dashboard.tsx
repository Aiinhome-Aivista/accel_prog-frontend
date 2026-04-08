import React, { useState, useEffect, useCallback } from "react";
// import LogoIcon from "../../../assets/logogod.svg";
import { useAuth } from "../../../hooks/context/AuthContext";
import { useToast } from "../../../utils/ToastContext";
import { useNavigate } from "react-router-dom";
import dashboardData from "./dashboardData.json";
import LogoutModal from "../../../modals/LogoutModal";
import { dashboardService } from "../../../services/dashboardService";
import BrandLogo from "../../../components/shared/BrandLogo";
import type {
  DashboardData,
  CourseData,
  DashboardKPI,
  StatItem,
  RawDashboardCourse,
  ActivityData,
  RecentActivityResponse,
} from "./dashboard.models";
import { useDashboard } from "../../../hooks/context/DashboardContext";

const typedDashboardData = dashboardData as DashboardData;

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "myCourses", label: "My Courses" },
  { id: "browse", label: "Browse" },
];

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const { kpiData, refreshKPI } = useDashboard();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [navOpen, setNavOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<CourseData[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseData[]>([]);
  const [completedEnrolledCourses, setCompletedEnrolledCourses] = useState<
    CourseData[]
  >([]);
  const [activeCourse, setActiveCourse] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [stats, setStats] = useState<StatItem[]>(typedDashboardData.stats);
  const [isLoadingEnrolled, setIsLoadingEnrolled] = useState(true);
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(true);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [activityMessage, setActivityMessage] = useState<string>("");
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const openModal = (name: string, id: string) => {
    setActiveCourse({ name, id });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const confirmSub = () => {
    if (activeCourse) {
      handleEnrollment(activeCourse.id);
    }
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      const userId = user?.id || 4;
      setIsLoadingAvailable(true);
      const response = await dashboardService.getDashboard(userId);
      if (response.status === "success" && Array.isArray(response.data)) {
        const mappedCourses = response.data.map(
          (course: RawDashboardCourse, index: number) => {
            const styles = [
              {
                bg: "rgba(232,122,46,.1)",
                color: "#E87A2E",
                banner: "linear-gradient(to right, #E87A2E, #D06A20)",
              },
              {
                bg: "rgba(66,133,244,.1)",
                color: "#4285F4",
                banner: "linear-gradient(to right, #4285F4, #2A66D8)",
              },
              {
                bg: "rgba(52,168,83,.1)",
                color: "#34A853",
                banner: "linear-gradient(to right, #34A853, #2B8A45)",
              },
              {
                bg: "rgba(251,188,5,.1)",
                color: "#B88E00",
                banner: "linear-gradient(to right, #FBBC05, #D4AF37)",
              },
            ];
            const style = styles[index % styles.length];

            return {
              id: course.course_id.toString(),
              title: course.course_name,
              badge: course.course_label,
              description: course.description,
              features: course.features || [],
              meta: [
                `⏱️ ${course.total_weeks} Weeks`,
                `📂 ${course.total_subtopics} Subtopics`,
                `🧩 ${course.capstone}`,
              ],
              badgeBg: style.bg,
              badgeColor: style.color,
              bannerGradient: style.banner,
            };
          },
        );
        setAvailableCourses(mappedCourses);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoadingAvailable(false);
    }
  }, [user]);


  const fetchEnrolledCourses = useCallback(async () => {
    const userId = user?.id || 1;
    setIsLoadingEnrolled(true);
    try {
      const mapCourses = (coursesData: any[]) => {
        return coursesData.map((course, index) => {
          const styles = [
            {
              bg: "rgba(232,122,46,.1)",
              color: "#E87A2E",
              banner: "linear-gradient(to right, #E87A2E, #D06A20)",
              progress: "#E87A2E",
            },
            {
              bg: "rgba(66,133,244,.1)",
              color: "#4285F4",
              banner: "linear-gradient(to right, #4285F4, #2A66D8)",
              progress: "#4285F4",
            },
            {
              bg: "rgba(52,168,83,.1)",
              color: "#34A853",
              banner: "linear-gradient(to right, #34A853, #2B8A45)",
              progress: "#34A853",
            },
            {
              bg: "rgba(251,188,5,.1)",
              color: "#B88E00",
              banner: "linear-gradient(to right, #FBBC05, #D4AF37)",
              progress: "#FBBC05",
            },
          ];
          const style = styles[index % styles.length];

          return {
            id: course.course_id.toString(),
            title: course.course_name,
            badge: course.status,
            description: course.description,
            meta: [
              `⏱️ ${course.total_weeks} Weeks`,
              `📂 ${course.total_subtopics} Subtopics`,
              `🧩 ${course.total_projects} Project`,
            ],
            progress: course.progress_pct,
            progressText: `${course.progress_pct}% Completed`,
            progressColor: style.progress,
            badgeBg: style.bg,
            badgeColor: style.color,
            bannerGradient: style.banner,
          };
        });
      };

      try {
        const enrolledRes = await dashboardService.getEnrolledCourses(userId);
        if (
          enrolledRes.status === "success" &&
          Array.isArray(enrolledRes.data)
        ) {
          setEnrolledCourses(mapCourses(enrolledRes.data));
        } else {
          setEnrolledCourses([]);
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        setEnrolledCourses([]);
      }

      try {
        const completedRes =
          await dashboardService.getCompletedCourses(userId);
        if (
          completedRes.status === "success" &&
          Array.isArray(completedRes.data)
        ) {
          setCompletedEnrolledCourses(mapCourses(completedRes.data));
        } else {
          setCompletedEnrolledCourses([]);
        }
      } catch (error) {
        console.error("Error fetching completed courses:", error);
        setCompletedEnrolledCourses([]);
      }
    } finally {
      setIsLoadingEnrolled(false);
    }
  }, [user]);

  const fetchRecentActivity = useCallback(async () => {
    const userId = user?.id || 1;
    setIsLoadingActivities(true);
    try {
      const response = await dashboardService.getUserRecentActivity(userId);
      if (response.status === "success" && response.data) {
        setActivities(response.data.activities || []);
        setActivityMessage(response.data.message || "");
      }
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    } finally {
      setIsLoadingActivities(false);
    }
  }, [user]);

  const refreshAllData = useCallback(() => {
    fetchDashboardData();
    refreshKPI();
    fetchEnrolledCourses();
    fetchRecentActivity();
  }, [fetchDashboardData, refreshKPI, fetchEnrolledCourses, fetchRecentActivity]);

  useEffect(() => {
    if (kpiData) {
      setStats((prevStats) =>
        prevStats.map((s) => {
          if (s.label === "In Progress")
            return { ...s, value: kpiData.in_progress_count.toString() };
          if (s.label === "Completed")
            return { ...s, value: kpiData.completed_count.toString() };
          if (s.label === "Day Streak")
            return { ...s, value: kpiData.streak_days.toString() };
          if (s.label === "Progress")
            return { ...s, value: `${kpiData.overall_progress}%` };
          return s;
        }),
      );
    }
  }, [kpiData]);

  const handleEnrollment = async (courseId: string | number) => {
    if (!user) {
      showError("Authentication Error", "You must be logged in to enroll.");
      closeModal();
      return;
    }
    const userId = user.id;
    const roleId = 2; // Default role_id per requirement

    setIsEnrolling(true);

    try {
      const response = await dashboardService.enrollInCourse({
        user_id: userId,
        course_id: Number(courseId),
        role_id: roleId,
      });

      if (response.status === "success" && response.course_id) {
        showSuccess("Enrolled Successfully", response.message);
        
        // Refresh all data to update My Courses and Browse sections
        refreshAllData();

        // Scroll to My Courses section
        setTimeout(() => {
          const myCoursesSection = document.getElementById("myCourses");
          if (myCoursesSection) {
            myCoursesSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 500);

        // const { course_id, current_module_id, first_subtopic_id } = response;
        // navigate(
        //   `/course-learning?course_id=${course_id}&module_id=${current_module_id}&subtopic_id=${first_subtopic_id}`,
        //   { replace: true },
        // );
      } else {
        showError(
          "Enrollment Failed",
          response.message || "Could not enroll in course.",
        );
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      showError(
        "Enrollment Error",
        "An unexpected error occurred during enrollment.",
      );
    } finally {
      setIsEnrolling(false);
      closeModal();
    }
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    e.preventDefault();
    const targetId = sectionId === "dashboard" ? "welcome-section" : sectionId;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setNavOpen(false); // Close mobile nav on click
  };

  useEffect(() => {
    const sectionIds = ["welcome-section", "myCourses", "browse"];
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);

    const handleScroll = () => {
      // Header is 60px, let's add a 20px buffer.
      const scrollPosition = window.scrollY + 80;

      let currentSectionId = "dashboard";
      for (const section of sectionElements) {
        if (section.offsetTop <= scrollPosition) {
          currentSectionId = section.id;
        } else {
          break;
        }
      }

      setActiveSection(
        currentSectionId === "welcome-section" ? "dashboard" : currentSectionId,
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);


  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user, fetchEnrolledCourses]);

  useEffect(() => {
    if (user) {
      fetchRecentActivity();
    }
  }, [user, fetchRecentActivity]);

  return (
    <div className="min-h-screen bg-[#F3EDE7] text-[#2B2D42] flex flex-col">
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
          {/* <a className="flex items-center gap-2" href="#/">
            <img
              src={LogoIcon}
              className="w-[30px] h-[30px] object-contain"
              alt="MokshPath Logo"
            />
            <span className="nav-logo">
              Moksh<span className="text-[#E87A2E]">Path</span>
            </span>
          </a> */}
          <a
            href="#"
            className="nav-logo"
            onClick={(e) => {
              e.preventDefault();
              // onCloseNav();
              // onGoHome();
            }}
          >
            <BrandLogo />
          </a>
          <div
            className={`md:flex items-center gap-4 ${navOpen ? "flex absolute top-[60px] left-0 right-0 bg-white border-b border-[#E5DDD4] p-4 flex-col shadow-lg" : "hidden md:flex"}`}
          >
            {(user?.access_control && user.access_control.length > 0
              ? user.access_control.map((ac) => ({
                  id:
                    ac.name === "My Courses"
                      ? "myCourses"
                      : ac.name.toLowerCase().replace(/\s+/g, ""),
                  label: ac.name,
                }))
              : navItems
            ).map((item) => {
              if (item.id === "programs") {
                return (
                  <a
                    key={item.id}
                    href="#/programs"
                    className="text-[13px] font-medium text-[#6B6D7B] hover:text-[#E87A2E] hover:bg-[#E87A2E]/10 py-1.5 px-2.5 rounded-md transition-colors"
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <a
                  key={item.id}
                  href={item.id === "dashboard" ? "#" : `#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`text-[13px] py-1.5 px-2.5 rounded-md transition-colors cursor-pointer ${
                    activeSection === item.id
                      ? "font-semibold text-[#E87A2E] bg-[#E87A2E]/10"
                      : "font-medium text-[#6B6D7B] hover:text-[#E87A2E] hover:bg-[#E87A2E]/10"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-[#2B2D42] hidden sm:block">
            {user?.name || "Learner"}
          </span>
          <div
            className="w-[34px] h-[34px] rounded-full bg-[#E87A2E]/10 flex items-center justify-center text-[12px] font-bold text-[#E87A2E] cursor-pointer"
            onClick={() => setIsLogoutModalOpen(true)}
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
        <div
          id="welcome-section"
          className="scroll-mt-20 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1
              className=" text-[clamp(1.4rem,2.5vw,1.8rem)] text-[#2B2D42] mb-1 font-bold"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              {typedDashboardData.welcome.title}, {user?.name || "Learner"}!
            </h1>
            <p className="text-[13.5px] text-[#6B6D7B] leading-relaxed">
              {typedDashboardData.welcome.streakText}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="px-5 py-2.5 rounded-lg border-none bg-[#E87A2E] hover:bg-[#D06A20] text-white text-[13px] font-semibold transition-colors cursor-pointer"
              onClick={() =>
                navigate("/course-learning?course_id=1", { replace: true })
              }
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
          {stats.map((stat) => (
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
                <div className=" text-[1.3rem] text-[#2B2D42]">
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
            <h2
              className="text-[1.15rem] text-[#2B2D42] font-bold"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              My Courses — In Progress
            </h2>
            <div className="text-[10px] font-bold px-2.5 py-[3px] rounded-full bg-[#E87A2E]/10 text-[#E87A2E]">
              {isLoadingEnrolled ? "-" : enrolledCourses.length} Active
            </div>
          </div>

          {isLoadingEnrolled ? (
            <div className="flex justify-center items-center py-16 mb-10 bg-white rounded-[14px] border border-[#E5DDD4]">
              <svg
                className="animate-spin h-10 w-10 text-[#E87A2E]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-[14px] border border-[#E5DDD4] p-8 text-center mb-10">
              <div className="text-2xl mb-2">📚</div>
              <p className="text-[13px] text-[#9597A6]">
                You’re not enrolled in any courses yet. Enroll now to start your
                learning journey!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {enrolledCourses.map((course) => (
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
                    <div
                      className=" text-[1rem] text-[#2B2D42] mb-1 leading-[1.3] font-medium"
                      style={{ fontFamily: '"DM Serif Display", serif' }}
                    >
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
                          navigate(`/course-learning?course_id=${course.id}`, {
                            replace: true,
                          })
                        }
                      >
                        Continue Learning
                      </button>
                      <button
                        className="flex-1 py-[7.5px] px-3 rounded-lg border-[1.5px] border-[#E5DDD4] bg-white text-[#6B6D7B] hover:text-[#E87A2E] hover:border-[#E87A2E] text-[11.8px] font-semibold transition-colors flex items-center justify-center cursor-pointer"
                        onClick={() =>
                          navigate(`/course-learning?course_id=${course.id}&tab=grades`, {
                            replace: true,
                          })
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
          <h2
            className=" text-[1.15rem] text-[#2B2D42] font-bold"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Completed Courses
          </h2>
          <div className="text-[10px] font-bold px-2.5 py-[3px] rounded-full bg-[#E8F5E9] text-[#4CAF50]">
            {isLoadingEnrolled ? "-" : completedEnrolledCourses.length} Done
          </div>
        </div>

        {isLoadingEnrolled ? (
          <div className="flex justify-center items-center py-16 mb-10 bg-white rounded-[14px] border border-[#E5DDD4]">
            <svg
              className="animate-spin h-10 w-10 text-[#E87A2E]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : completedEnrolledCourses.length === 0 ? (
          <div className="bg-white rounded-[14px] border border-[#E5DDD4] p-8 text-center mb-10">
            <div className="text-2xl mb-2">🎓</div>
            <p className="text-[13px] text-[#9597A6]">
              No completed courses yet. Keep going — your first certificate is
              within reach!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {completedEnrolledCourses.map((course) => (
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
                  <div
                    className=" text-[1rem] text-[#2B2D42] mb-1 leading-[1.3] font-medium"
                    style={{ fontFamily: '"DM Serif Display", serif' }}
                  >
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

                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-[7.5px] px-3 rounded-lg border-none bg-[#E87A2E] hover:bg-[#D06A20] text-white text-[11.8px] font-semibold transition-colors flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        navigate(`/course-learning?course_id=${course.id}`, {
                          replace: true,
                        })
                      }
                    >
                      Review Course
                    </button>
                    <button
                      className="flex-1 py-[7.5px] px-3 rounded-lg border-[1.5px] border-[#E5DDD4] bg-white text-[#6B6D7B] hover:text-[#E87A2E] hover:border-[#E87A2E] text-[11.8px] font-semibold transition-colors flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/course-learning?course_id=${course.id}&tab=grades`,
                          { replace: true },
                        )
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

        {/* Browse More */}
        <div id="browse" className="scroll-mt-20">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-[1.15rem] text-[#2B2D42] font-bold"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              Browse More Courses
            </h2>
            <div className="text-[10px] font-bold px-2.5 py-[3px] rounded-full bg-[rgba(66,133,244,.1)] text-[#4285F4]">
              {isLoadingAvailable ? "-" : availableCourses.length} Available
            </div>
          </div>

          {isLoadingAvailable ? (
            <div className="flex justify-center items-center py-16 mb-10 bg-white rounded-[14px] border border-[#E5DDD4]">
              <svg
                className="animate-spin h-10 w-10 text-[#4285F4]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : availableCourses.length === 0 ? (
            <div className="bg-white rounded-[14px] border border-[#E5DDD4] p-8 text-center mb-10">
              <div className="text-2xl mb-2">🔍</div>
              <p className="text-[13px] text-[#9597A6]">
                No courses available at the moment. Please check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {availableCourses.map((course) => (
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
                    <div
                      className=" text-base text-[#2B2D42] mb-1 leading-[1.3] font-medium"
                      style={{ fontFamily: '"DM Serif Display", serif' }}
                    >
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
                      {course.features?.map((feat: string, i: number) => (
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
          )}
        </div>

        {/* Recent Activity */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <h2
            className=" text-[1.15rem] text-[#2B2D42] font-bold"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Recent Activity
          </h2>
        </div>
        <div className="bg-white rounded-[14px] border border-[#E5DDD4] overflow-hidden mb-8">
          {isLoadingActivities ? (
            <div className="flex justify-center items-center py-10">
              <svg
                className="animate-spin h-8 w-8 text-[#E87A2E]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : activities.length > 0 ? (
            activities.map((act, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3.5 hover:bg-[#F9F5F0] transition-colors border-b last:border-b-0 border-[rgba(0,0,0,.04)]"
              >
                <div
                  className="w-[32px] h-[32px] rounded-lg flex items-center justify-center text-[13.5px] shrink-0"
                  style={{ background: act.iconBg || "rgba(232,122,46,.1)" }}
                >
                  {act.icon || "🚀"}
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
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="text-2xl mb-2">✨</div>
              <p className="text-[13px] text-[#9597A6]">
                {activityMessage ||
                  "No recent activity yet. Start a course to see your progress and achievements here."}
              </p>
            </div>
          )}
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
            <h3 className=" text-[1.2rem] text-[#2B2D42] mb-1.5">
              Subscribe to {activeCourse?.name}
            </h3>
            <p className="text-[13px] text-[#6B6D7B] mb-6 leading-[1.5]">
              You're about to enroll in this course. Once subscribed, it will
              appear in your dashboard and you can start learning immediately.
            </p>
            <button
              className="w-full py-[11px] rounded-lg border-none bg-gradient-to-br from-[#E87A2E] to-[#D06A20] text-white text-[13.5px] font-semibold hover:shadow-[0_4px_16px_rgba(232,122,46,.35)] shadow-[0_2px_10px_rgba(232,122,46,.25)] transition-all flex items-center justify-center cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              onClick={confirmSub}
              disabled={isEnrolling}
            >
              {isEnrolling ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enrolling...
                </>
              ) : (
                "Confirm Enrollment"
              )}
            </button>
            <p className="text-[11px] text-[#9597A6] mt-3 mb-0">
              Free during Summer 2026 pilot program
            </p>
          </div>
        </div>
      )}

      <LogoutModal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={onLogout}
      />
    </div>
  );
};

export default Dashboard;
