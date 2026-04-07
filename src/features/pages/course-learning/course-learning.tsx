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
import { WK } from './course-learning.data';
import { Link, useSearchParams } from 'react-router-dom';
import LogoIcon from '../../../assets/logogod.svg';

const CourseLearning: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "home";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Cross-tab state
  const [done, setDone] = useState<Set<string>>(new Set());
  const [curW, setCurW] = useState(0);

  // Expose function to mark done globally so it cascades logic
  const markDone = (id: string) => {
    setDone(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // Check globals unlocking
  useEffect(() => {
    for (let i = 0; i < WK.length - 1; i++) {
      const isWeekComplete = WK[i].subs.every(s => done.has(s.id));
      if (isWeekComplete) {
        WK[i + 1].ul = true;
      }
    }
  }, [done]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab goToCourseContent={(weekIdx: number) => { setCurW(weekIdx); setActiveTab('learn'); }} done={done} />;
      case 'modules':
        return <ModulesTab />;
      case 'learn':
        return <CourseContentTab curW={curW} setCurW={setCurW} done={done} markDone={markDone} />;
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
        return <HomeTab goToCourseContent={(w) => { setCurW(w); setActiveTab('learn'); }} done={done} />;
    }
  };

  return (
    <div className=" bg-[#F3EDE7] text-[#2B2D42] antialiased overflow-hidden h-screen flex flex-col">
      {/* Top Navbar */}
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

          <a href="#" className="flex items-center gap-[0.35rem] no-underline ml-2">
            <img
                         src={LogoIcon}
                         className="w-[30px] h-[30px] object-contain"
                         alt="MokshPath Logo"
                       />
            <span className="font-['DM_Serif_Display'] text-[0.9rem] text-[#2B2D42]">Moksh<em className="not-italic text-[#E87A2E]">Path</em></span>
          </a>
        </div>
        <div className="flex items-center gap-[0.5rem]">
          <div className="flex items-center gap-[0.25rem] px-[0.55rem] py-[0.2rem] rounded-full bg-gradient-to-br from-[#FF6B35] to-[#F7931E] text-white text-[0.62rem] font-bold">
            🔥 5
          </div>
          <div className="w-[28px] h-[28px] rounded-full bg-[#e87a2e1f] flex items-center justify-center text-[0.6rem] font-bold text-[#E87A2E]">
            L
          </div>
        </div>
      </div>

      {/* Main App Shell */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-50px)]">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
        />
        <div className="flex-1 overflow-y-auto bg-[#F3EDE7] relative">
          {renderActiveTab()}
        </div>
      </div>

      {/* AI Assistant */}
      <AiCompanion />
    </div>
  );
};

export default CourseLearning;
