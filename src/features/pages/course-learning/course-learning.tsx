import React, { useState, useEffect, useRef } from 'react';
import { Menu, ChevronLeft } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { AiCompanion } from './components/AiCompanion';
import { HomeTab } from './components/Tabs/HomeTab';
import { ModulesTab } from './components/Tabs/ModulesTab';
import { CourseContentTab } from './components/Tabs/CourseContentTab';
import { GradesTab } from './components/Tabs/GradesTab';
import { PeopleTab } from './components/Tabs/PeopleTab';
import { AnnouncementsTab } from './components/Tabs/AnnouncementsTab';
import { FlashcardsTab } from './components/Tabs/FlashcardsTab';
import { SupportTab } from './components/Tabs/SupportTab';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/context/AuthContext';
import { useDashboard } from '../../../hooks/context/DashboardContext';
import BrandLogo from '../../../components/shared/BrandLogo';
import { dashboardService } from '../../../services/dashboardService';
import type { ApiWeek, WeekData } from './course-learning.models';

const CourseLearning: React.FC = () => {
  const { user } = useAuth();
  const { kpiData } = useDashboard();
  const [searchParams, setSearchParams] = useSearchParams();
  const getStoredState = () => {
    const courseId = searchParams.get("course_id");
    if (courseId && user) {
      try {
        const item = localStorage.getItem(`course_state_${user.id}_${courseId}`);
        if (item) return JSON.parse(item);
      } catch (e) {
        // ignore
      }
    }
    return null;
  };

  const storedState = getStoredState();
  const initialTab = searchParams.get("tab") || storedState?.activeTab || "home";
  const initialWeekIdx = Number(searchParams.get("week_idx") ?? storedState?.curW ?? 0);
  const initialSubIdx = Number(searchParams.get("sub_idx") ?? storedState?.curS ?? 0);
  
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Cross-tab state
  const [done, setDone] = useState<Set<string>>(new Set());
  const [curW, setCurW] = useState<number>(initialWeekIdx);
  const [curS, setCurS] = useState<number>(initialSubIdx);
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [courseName, setCourseName] = useState("Course Learning");
  const [introVideo, setIntroVideo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API is the source of truth for completion state
  const markDone = (id: string) => {
    setDone(prev => new Set([...Array.from(prev), id]));
  };

  const fetchContent = React.useCallback(async () => {
      const courseId = searchParams.get("course_id");
      const userId = user?.id;

      if (courseId && userId) {
        try {
          setIsLoading(true);
          
          // Fetch both content and videos
          const [response, videoRes] = await Promise.all([
            dashboardService.getCourseLearningContent(Number(courseId), userId),
            dashboardService.getCourseVideos(Number(courseId))
          ]);

          if (response.status === "success" && response.data) {
            setCourseName(response.data.course_name);
            
            const videos = videoRes.status === "success" ? videoRes.data : (videoRes.course_intro_video || videoRes.week_videos ? videoRes : null);
            if (videos) {
              setIntroVideo(videos.course_intro_video);
            }

            const mappedWeeks: WeekData[] = response.data.weeks.map((apiWeek: ApiWeek) => ({
              id: `w${apiWeek.week}`,
              t: apiWeek.module_name,
              short: `Week ${apiWeek.week}`,
              ul: !apiWeek.is_locked,
              color: apiWeek.week === 1 ? "#E87A2E" : apiWeek.week === 2 ? "#E8A040" : apiWeek.week === 3 ? "#66BB6A" : "#4CAF50",
              moduleId: apiWeek.module_id,
              topics: apiWeek.topics.map(t => ({
                d: `Topic ${t.subtopic_id}`,
                t: t.title,
                n: t.subtitle || "",
              })),
              subs: apiWeek.topics.map(t => {
                const sub: any = {
                  id: `w${apiWeek.week}s${t.subtopic_id}`,
                  type: (t.type === 'assessment' ? 'assess' : t.type) as any,
                  title: t.title,
                  moduleName: apiWeek.module_name,
                };
                
                if (t.type === 'video' && videos) {
                  const vData = videos.week_videos?.find((v: any) => 
                    v.module_id === apiWeek.module_id && v.subtopic_id === t.subtopic_id
                  );
                  if (vData) {
                    sub.videoPath = vData.video_path;
                    sub.videoTitle = vData.video_title;
                    sub.videoDesc = vData.video_subtitle;
                    sub.videoDuration = vData.duration_sec;
                  }
                }

                const contentData = t.content.data;
                if (t.type === 'assessment' && Array.isArray(contentData)) {
                  sub.categories = contentData.map((cat: any) => ({
                    label: cat.category_name,
                    questions: cat.questions.map((q: any) => ({
                      id: q.question_id,
                      q: q.question_text,
                      type: q.type_id === 1 ? 'mcq' : 'subjective',
                      opts: q.options || undefined,
                      marks: q.marks
                    }))
                  }));
                } else {
                  sub.content = contentData;
                  if (t.type === 'discussion' && Array.isArray(contentData)) {
                    sub.topic = contentData[0]?.question_text || "";
                  }
                }
                return sub;
              }),
              progress: apiWeek.progress
            }));
            setWeeks(mappedWeeks);
            
            const initialDone = new Set<string>();
            let foundUnfinished = false;
            let autoW = 0;
            let autoS = 0;

            response.data.weeks.forEach((w: any, wi: number) => {
              w.topics.forEach((t: any, si: number) => {
                if (t.is_completed) {
                  initialDone.add(`w${w.week}s${t.subtopic_id}`);
                } else if (!foundUnfinished && !w.is_locked) {
                  autoW = wi;
                  autoS = si;
                  foundUnfinished = true;
                }
              });
            });
            
            setDone(initialDone);

            // Auto-forward to the furthest topic if the current one is completed
            // This prevents users from being dumped back to topic 1 on revisit
            const currentSubtopicId = mappedWeeks[curW]?.subs[curS]?.id;
            if (currentSubtopicId && initialDone.has(currentSubtopicId)) {
                if (foundUnfinished) {
                    setCurW(autoW);
                    setCurS(autoS);
                } else {
                    setCurW(mappedWeeks.length - 1);
                    setCurS(mappedWeeks[mappedWeeks.length - 1].subs.length - 1);
                }
            }

            setError(null);
          } else if (response.status === "error") {
            setError(response.message || "Failed to load course content");
          }
        } catch (error) {
          console.error("Error fetching course content:", error);
          setError("An unexpected error occurred while loading course content.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setError("Missing course or user information.");
      }
  }, [searchParams.get("course_id"), user]);

  // Initial load
  useEffect(() => {
    const courseId = searchParams.get("course_id");
    let savedW = 0;
    let savedS = 0;
    if (courseId && user) {
      try {
        const item = localStorage.getItem(`course_state_${user.id}_${courseId}`);
        if (item) {
          const parsed = JSON.parse(item);
          savedW = parsed.curW ?? 0;
          savedS = parsed.curS ?? 0;
        }
      } catch (e) {
        // ignore
      }
    }
    const weekIdx = Number(searchParams.get("week_idx") ?? savedW);
    const subIdx = Number(searchParams.get("sub_idx") ?? savedS);
    setDone(new Set());
    setCurW(weekIdx);
    setCurS(subIdx);
    setIntroVideo(null);
    setWeeks([]);
    fetchContent();
  }, [searchParams.get("course_id"), user, fetchContent, activeTab]);

  // Re-fetch when switching to a week with no content (newly unlocked)
  useEffect(() => {
    if (weeks.length > 0 && weeks[curW] && weeks[curW].subs.length === 0 && weeks[curW].ul) {
      fetchContent();
    }
  }, [curW, weeks]);

  // Persist state to localStorage and sync URL
  useEffect(() => {
    const courseId = searchParams.get("course_id");
    if (courseId && user) {
      const state = {
        activeTab,
        curW,
        curS
      };
      localStorage.setItem(`course_state_${user.id}_${courseId}`, JSON.stringify(state));
      
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        if (next.get("tab") !== activeTab) next.set("tab", activeTab);
        if (next.get("week_idx") !== curW.toString()) next.set("week_idx", curW.toString());
        if (next.get("sub_idx") !== curS.toString()) next.set("sub_idx", curS.toString());
        return next;
      }, { replace: true });
    }
  }, [activeTab, curW, curS, searchParams.get("course_id"), user, setSearchParams]);

  // Scroll content area to top whenever the active tab changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeTab]);



  useEffect(() => {
    if (weeks.length === 0) return;
    setWeeks(prev => {
      const next = [...prev];
      for (let i = 0; i < next.length - 1; i++) {
        // A week is only complete if it's unlocked, has subs, and all subs are done
        const isWeekComplete = next[i].ul && next[i].subs.length > 0 && next[i].subs.every(s => done.has(s.id));
        if (isWeekComplete) {
          next[i + 1].ul = true;
        }
      }
      return next;
    });
  }, [done]);

  const renderActiveTab = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-[calc(100vh-100px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E87A2E]"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col justify-center items-center h-full p-6 text-center">
          <div className="text-[2rem] mb-4">⚠️</div>
          <h2
            className="text-[1.3rem] text-[#2B2D42] mb-2 font-bold"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {error}
          </h2>
          <p className="text-[0.9rem] text-[#6B6D7B] mb-6 max-w-[400px]">
            {error === "User not enrolled"
              ? "It seems you are not enrolled in this course yet. Please enroll from the dashboard to access the content."
              : "We encountered an issue while loading your course content. Please try again later."}
          </p>
            <Link
              to="/dashboard"
              className="btn-std-primary"
            >
              Back to Dashboard
            </Link>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomeTab goToCourseContent={(weekIdx: number) => { setCurW(weekIdx); setCurS(0); setActiveTab('learn'); }} courseId={Number(searchParams.get("course_id"))} userId={user?.id as number} introVideo={introVideo} />;
      case 'modules':
        return <ModulesTab />;
      case 'learn':
        return <CourseContentTab 
          key={searchParams.get("course_id")}
          weeks={weeks} 
          curW={curW} 
          setCurW={(w) => { setCurW(w); setCurS(0); }} 
          curS={curS}
          setCurS={setCurS}
          done={done} 
          markDone={markDone} 
          courseId={Number(searchParams.get("course_id")) as number} 
          userId={user?.id as number} 
          refetchContent={fetchContent}
        />;
      case 'grades':
        return <GradesTab done={done} />;
      case 'people':
        return <PeopleTab />;
      case 'ann':
        return <AnnouncementsTab />;
      case 'flash':
        return <FlashcardsTab />;
      case 'support':
        return <SupportTab />;
      default:
        return <HomeTab goToCourseContent={(w) => { setCurW(w); setCurS(0); setActiveTab('learn'); }} courseId={Number(searchParams.get("course_id"))} userId={user?.id as number} introVideo={introVideo} />;
    }
  };

  return (
    <div className=" bg-[#F3EDE7] text-[#2B2D42] antialiased overflow-hidden h-screen flex flex-col">
      <div className="bg-white border-b border-[#E5DDD4] h-[50px] flex items-center justify-between px-[1rem] z-[60] relative shrink-0">
        <div className="flex items-center gap-[0.7rem]">
          <button 
            className="md:hidden bg-transparent border-none cursor-pointer p-[0.2rem] text-[#6B6D7B]"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={20} />
          </button>
          
          <Link to="/dashboard" className="std-nav-item flex items-center gap-[0.2rem]">
            <ChevronLeft size={12} /> Dashboard
          </Link>

          <a
          href="#"
          className="nav-logo flex-align-center gap-05"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <BrandLogo />
        </a>
        </div>
        <div className="flex items-center gap-[0.5rem]">
          <div className="std-badge" style={{ background: "linear-gradient(to bottom right, #FF6B35, #F7931E)", color: "white" }}>
            🔥 {kpiData?.streak_days || 0}
          </div>
          <div 
            className="std-stat-icon"
            style={{ background: "rgba(232, 122, 46, 0.1)", color: "#E87A2E", width: "28px", height: "28px", fontSize: "0.7rem" }}
            title={user?.name || "User"}
          >
            {user?.name?.[0]?.toUpperCase() || "L"}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-50px)]">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          courseName={courseName}
        />
        <div ref={contentRef} className="flex-1 overflow-y-auto bg-[#F3EDE7] relative">
          {renderActiveTab()}
        </div>
      </div>

      <AiCompanion />
    </div>
  );
};

export default CourseLearning;
