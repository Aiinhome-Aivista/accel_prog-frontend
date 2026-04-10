import { useEffect, useState } from "react";
import { COURSE_DATA } from "../../../data/courseData";
import { courseService } from "../../../services/courseService";
import Header from "../../../common/Header";
import Footer from "../../../common/Footer";
import type { CourseItem, ProgramStats } from "../../../types/registration";
import HeroIcon from "../../../assets/hero.svg";

interface LandingPageProps {
  onSignInClick: () => void;
  onExploreCourse: (index: number) => void;
  onCoursesLoaded: (data: CourseItem[]) => void;
  navOpen: boolean;
  onToggleNav: () => void;
  onCloseNav: () => void;
  onGoHome: () => void;
}

function LandingPage({
  onSignInClick,
  onExploreCourse,
  onCoursesLoaded,
  navOpen,
  onToggleNav,
  onCloseNav,
  onGoHome,
}: LandingPageProps) {
  const [courseData, setCourseData] = useState<CourseItem[]>(COURSE_DATA);
  const [programStats, setProgramStats] = useState<ProgramStats>({
    total_courses: 4,
    total_modules: 12,
    total_capstones: 4,
    years_experience: 20,
  });

  const mapCourseData = (apiResponse: any): CourseItem[] => {
    const courses = apiResponse?.data?.courses || [];
    return courses.map((course: any, index: number) => ({
      label: `Course ${index + 1}`,
      title: course.course_name,
      focus: course.tagline || course.description,
      level: course.course_level,
      color: ((index % 4) + 1) as 1 | 2 | 3 | 4,
      modules: (course.modules || [])
        .sort((a: any, b: any) => a.module_order - b.module_order)
        .map((mod: any, i: number) => ({
          name: `Module ${i + 1}: ${mod.module_name}`,
          desc: mod.module_description,
        })),
      outcome: `${course.capstone?.title || ""} - ${course.capstone?.description || ""}`,
      tags: course.tags || [],
    }));
  };

  const handleGetCourseData = async () => {
    try {
      const res = await courseService.getCourse();
      const formatted = mapCourseData(res);
      if (formatted.length > 0) {
        setCourseData(formatted);
        onCoursesLoaded(formatted);
      }

      const stats = res?.data?.program?.stats;
      if (stats) {
        setProgramStats({
          total_courses: stats.total_courses ?? 4,
          total_modules: stats.total_modules ?? 12,
          total_capstones: stats.total_capstones ?? 4,
          years_experience: stats.years_experience ?? 20,
        });
      }
    } catch (err: any) {
      console.error("Error fetching course data:", err);
    }
  };

  useEffect(() => {
    handleGetCourseData();
  }, []);

  return (
    <div className="landing-page" id="landingPage">
      <Header
        onSignInClick={onSignInClick}
        onToggleNav={onToggleNav}
        onCloseNav={onCloseNav}
        onGoHome={onGoHome}
        navOpen={navOpen}
      />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot"></span> Summer 2026
            </div>
            <h1>
              The <em>AI-Native</em> Summer Series
            </h1>
            <p className="hero-sub">
              Four accelerated courses that take you from AI consumer to AI
              builder - from prompt engineering to autonomous agents. Curated by
              industry leaders.
            </p>
            <div className="hero-cta">
              <button
                className="btn-signin btn-signin-fill"
                onClick={onSignInClick}
              >
                Enroll Now
              </button>
              <button
                className="btn-signin btn-outline"
                onClick={() =>
                  document
                    .getElementById("courses")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Courses
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-circle"></div>
            <div className="hero-stats-float">
              <div
                className="hero-stat-card"
                style={{ animation: "float 3s ease-in-out infinite" }}
              >
                <div className="hero-stat-num">
                  {programStats.total_courses}
                </div>
                <div className="hero-stat-label">Courses</div>
              </div>
              <div
                className="hero-stat-card"
                style={{ animation: "float 3s ease-in-out .4s infinite" }}
              >
                <div className="hero-stat-num">
                  {programStats.total_modules}
                </div>
                <div className="hero-stat-label">Modules</div>
              </div>
              <div
                className="hero-stat-card"
                style={{ animation: "float 3s ease-in-out .8s infinite" }}
              >
                <div className="hero-stat-num">
                  {programStats.total_capstones}
                </div>
                <div className="hero-stat-label">Capstones</div>
              </div>
              <div
                className="hero-stat-card"
                style={{ animation: "float 3s ease-in-out 1.2s infinite" }}
              >
                <div className="hero-stat-num">
                  {programStats.years_experience}+
                </div>
                <div className="hero-stat-label">Yrs Expertise</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pathway">
        <div className="container">
          <div className="section-header">
            <div className="section-label">
              <div className="ico">
                <svg viewBox="0 0 10 10" fill="none">
                  <path
                    d="M1 5h8M5 1v8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              Learning Pathway
            </div>

            <div className="section-title">Your AI-Native Journey</div>

            <p className="section-sub">
              Four progressive courses - each building on the last - from using
              AI to building autonomous systems.
            </p>
          </div>

          <div className="pathway-track fade-in">
            <div className="pathway-step">
              <div className="pathway-num">1</div>
              <div className="pathway-week">Course 1</div>
              <div className="pathway-name">AI Consumer & Builder</div>
              <div className="pathway-sessions">Foundation</div>
            </div>

            <div className="pathway-step">
              <div className="pathway-num">2</div>
              <div className="pathway-week">Course 2</div>
              <div className="pathway-name">Data & ML Architect</div>
              <div className="pathway-sessions">Core</div>
            </div>

            <div className="pathway-step">
              <div className="pathway-num">3</div>
              <div className="pathway-week">Course 3</div>
              <div className="pathway-name">Gen AI & RAG Specialist</div>
              <div className="pathway-sessions">Applied</div>
            </div>

            <div className="pathway-step">
              <div className="pathway-num">4</div>
              <div className="pathway-week">Course 4</div>
              <div className="pathway-name">Agentic & Deep Tech</div>
              <div className="pathway-sessions">Advanced</div>
            </div>
          </div>
        </div>
      </section>

      <section id="instructor">
        <div className="container">
          <div className="instructor-card fade-in">
            <div className="instructor-icon-wrap">
              <svg viewBox="0 0 50 50" fill="none">
                <circle cx="25" cy="15" r="7" stroke="#fff" strokeWidth="2" />
                <path
                  d="M12 38c0-5.5 5.8-10 13-10s13 4.5 13 10"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="37"
                  cy="15"
                  r="5"
                  stroke="#fff"
                  strokeWidth="1.5"
                  opacity=".6"
                />
                <path
                  d="M42 32c2.5 1 5 3.5 5 7"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity=".6"
                />
                <circle
                  cx="13"
                  cy="15"
                  r="5"
                  stroke="#fff"
                  strokeWidth="1.5"
                  opacity=".6"
                />
                <path
                  d="M8 32c-2.5 1-5 3.5-5 7"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity=".6"
                />
              </svg>
            </div>

            <div className="instructor-info">
              <h3>Curated by Industry Leaders</h3>

              <div className="instructor-role">
                Designed and delivered by seasoned professionals with 20+ years
                of hands-on experience in AI, Machine Learning, Data Science,
                and Enterprise Technology.
              </div>

              <div className="instructor-creds">
                <span className="instructor-cred">20+ Years Experience</span>
                <span className="instructor-cred">Enterprise AI</span>
                <span className="instructor-cred">Gen AI & LLMs</span>
                <span className="instructor-cred">MLOps & Cloud</span>
                <span className="instructor-cred">AI Governance</span>
                <span className="instructor-cred">Deep Tech</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="courses">
        <div className="container">
          <div className="section-header">
            <div className="section-label">
              <div className="ico">
                <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <rect
                    x="1"
                    y="1"
                    width="8"
                    height="8"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                </svg>
              </div>
              Courses
            </div>
            <div className="section-title">
              {(() => {
                const words: Record<number, string> = {
                  1: "One",
                  2: "Two",
                  3: "Three",
                  4: "Four",
                  5: "Five",
                  6: "Six",
                };
                return `${words[programStats.total_courses] ?? programStats.total_courses} Course${programStats.total_courses !== 1 ? "s" : ""}. One Transformation.`;
              })()}
            </div>
            <p className="section-sub">
              From using AI to building autonomous, enterprise-grade systems —
              each the course ends with a real-world capstone.
            </p>
          </div>

          <div className="courses-grid">
            {courseData.map((course, index) => (
              <div className="course-card fade-in" key={course.title}>
                <div className="course-card-top"></div>
                <div className="course-card-body">
                  <div className="course-card-header">
                    <div className="course-card-week">{course.label}</div>
                    <div className="course-card-level">{course.level}</div>
                  </div>

                  <h3>{course.title}</h3>
                  <div className="course-focus">{course.focus}</div>
                  <p>{course.modules[0]?.desc}</p>

                  <div className="course-meta">
                    <div className="course-meta-item">
                      {course.modules.length} Modules
                    </div>
                    <div className="course-meta-item">Capstone</div>
                  </div>

                  <div className="course-tags">
                    {(course.tags && course.tags.length > 0
                      ? course.tags
                      : course.modules.map((m) =>
                          m.name
                            .replace(/Module \d+: /, "")
                            .split(" ")
                            .slice(0, 2)
                            .join(" "),
                        )
                    ).map((tag, i) => (
                      <span className="course-tag" key={`${tag}-${i}`}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="course-outcome">
                    <div className="course-outcome-label">Capstone</div>
                    <p>{course.outcome}</p>
                  </div>

                  <button
                    className="btn-explore"
                    onClick={() => onExploreCourse(index)}
                  >
                    Explore More
                    <svg viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <path
                        d="M3 7.5h9M8.5 4l3.5 3.5-3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-label">
              <div className="ico">*</div>
              Why This Program
            </div>
            <div className="section-title">Built for Real Impact</div>
            <p className="section-sub">
              Everything you need to go from AI consumer to AI builder - and
              beyond.
            </p>
          </div>

          <div className="features-grid">
            {[
              [
                "Project-Based Learning",
                "Every course ends with a capstone - from AI research assistants to autonomous social-good agents.",
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  key="svg-1"
                >
                  <path
                    d="M4 16l3-3 2.5 2.5L16 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="16"
                    cy="9"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                </svg>,
                "#e87a2e",
                "#fcefe6",
              ],
              [
                "Industry Leaders",
                "Curated by professionals with 20+ years in AI, enterprise tech, and deep tech research.",
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  key="svg-2"
                >
                  <path
                    d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 14.7l-4.9 2.5.9-5.5-4-3.9 5.5-.8L10 2z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>,
                "#4caf50",
                "#edf7ed",
              ],
              [
                "AI-Native Approach",
                "Learn to instruct AI, not just use it - from CoT prompting to multi-agent workflows.",
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  key="svg-3"
                >
                  <rect
                    x="3"
                    y="3"
                    width="14"
                    height="14"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M7 10l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>,
                "#efa36f", // Blue icon color
                "#fcefe6", // Light blue background
              ],
              [
                "Progressive Tracks",
                "Foundation to Advanced - deep mastery through structured progression.",
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  key="svg-4"
                >
                  <circle
                    cx="10"
                    cy="7"
                    r="3.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M3 18c0-3 3.1-5.5 7-5.5s7 2.5 7 5.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                </svg>,
                "#92ce94",
                "#edf7ed",
              ],
              [
                "Real-World Relevance",
                "Capstones grounded in real domains like MSMEs, agriculture, sustainability, and disaster response.",
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  key="svg-5"
                >
                  <path
                    d="M4 15l4-4 3 3 5-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13 5h3v3"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>,
                "#e87a2e",
                "#fcefe6",
              ],
              [
                "Responsible AI",
                "Bias detection, data privacy, ethical frameworks, and AI governance woven into every course.",
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  key="svg-6"
                >
                  <path
                    d="M8 3H5a2 2 0 00-2 2v3m0 4v3a2 2 0 002 2h3m4 0h3a2 2 0 002-2v-3m0-4V5a2 2 0 00-2-2h-3"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>,
                "#74c177",
                "#edf7ed",
              ],
            ].map(([title, desc, icon, color, bgColor]) => (
              <div className="feature fade-in" key={title as string}>
                {/* Apply the dynamic colors using inline styles */}
                <div
                  className="feature-icon"
                  style={{
                    color: color as string,
                    backgroundColor: bgColor as string,
                  }}
                >
                  {icon as React.ReactNode}
                </div>
                <h4>{title as string}</h4>
                <p>{desc as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-box fade-in">
            <img
              src={HeroIcon}
              className="mb-6 h-60 w-60"
              alt="Logo"
              aria-hidden="true"
            />
            <div className="text-left">
              <h2>Ready to Become AI-Native?</h2>
              <p>
                Join the Summer 2026 cohort and transform from AI consumer to AI
                builder with real-world capstone projects.
              </p>
              <button
                className="btn-signin btn-signin-fill"
                onClick={onSignInClick}
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer
        onSignInClick={onSignInClick}
        onCloseNav={onCloseNav}
        onGoHome={onGoHome}
      />
    </div>
  );
}

export default LandingPage;
