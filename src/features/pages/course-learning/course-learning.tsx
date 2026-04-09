import React, { useState, useEffect } from 'react';
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
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "home";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Cross-tab state
  const [done, setDone] = useState<Set<string>>(new Set());
  const [curW, setCurW] = useState(0);
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [courseName, setCourseName] = useState("Course Learning");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const courseId = searchParams.get("course_id");
      const userId = user?.id;

      if (courseId && userId) {
        try {
          setIsLoading(true);
          const response = await dashboardService.getCourseLearningContent(Number(courseId), userId);
          if (response.status === "success" && response.data) {
            setCourseName(response.data.course_name);
            const mappedWeeks: WeekData[] = response.data.weeks.map((apiWeek: ApiWeek) => ({
              id: `w${apiWeek.week}`,
              t: apiWeek.module_name,
              short: `Week ${apiWeek.week}`,
              ul: !apiWeek.is_locked,
              color: apiWeek.week === 1 ? "#E87A2E" : apiWeek.week === 2 ? "#E8A040" : apiWeek.week === 3 ? "#66BB6A" : "#4CAF50",
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
                };
                
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
                } else if (t.type === 'discussion' && Array.isArray(contentData)) {
                  sub.topic = contentData[0]?.question_text || "";
                } else if (typeof contentData === 'string') {
                  sub.content = contentData;
                }
                return sub;
              }),
              progress: apiWeek.progress
            }));
            setWeeks(mappedWeeks);
            
            const initialDone = new Set<string>();
            response.data.weeks.forEach(w => {
              w.topics.forEach(t => {
                if (t.is_completed) {
                  initialDone.add(`w${w.week}s${t.subtopic_id}`);
                }
              });
            });
            setDone(initialDone);
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
    };

    fetchContent();
  }, [searchParams, user]);

  const markDone = (id: string) => {
    setDone(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

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
            className="px-6 py-2.5 rounded-lg bg-[#E87A2E] text-white font-semibold no-underline hover:bg-[#D06A20] transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomeTab weeks={weeks} goToCourseContent={(weekIdx: number) => { setCurW(weekIdx); setActiveTab('learn'); }} done={done} />;
      case 'modules':
        return <ModulesTab />;
      case 'learn':
        return <CourseContentTab 
          weeks={weeks} 
          curW={curW} 
          setCurW={setCurW} 
          done={done} 
          markDone={markDone} 
          courseId={Number(searchParams.get("course_id")) as number} 
          userId={user?.id as number} 
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
        return <HomeTab weeks={weeks} goToCourseContent={(w) => { setCurW(w); setActiveTab('learn'); }} done={done} />;
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
          
          <Link to="/dashboard" className="flex items-center gap-[0.2rem] no-underline text-[0.74rem] font-medium text-[#9597A6] p-[0.25rem_0.4rem] rounded-[5px] transition-all hover:text-[#E87A2E] hover:bg-[#e87a2e1f]">
            <ChevronLeft size={12} /> Dashboard
          </Link>

          <a
          href="#"
          className="nav-logo"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <BrandLogo />
        </a>
        </div>
        <div className="flex items-center gap-[0.5rem]">
          <div className="flex items-center gap-[0.25rem] px-[0.55rem] py-[0.2rem] rounded-full bg-gradient-to-br from-[#FF6B35] to-[#F7931E] text-white text-[0.62rem] font-bold">
            🔥 {kpiData?.streak_days || 0}
          </div>
          <div 
            className="w-[28px] h-[28px] rounded-full bg-[#e87a2e1f] flex items-center justify-center text-[0.6rem] font-bold text-[#E87A2E] cursor-pointer"
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
        <div className="flex-1 overflow-y-auto bg-[#F3EDE7] relative">
          {renderActiveTab()}
        </div>
      </div>

      <AiCompanion />
    </div>
  );
};

export default CourseLearning;
