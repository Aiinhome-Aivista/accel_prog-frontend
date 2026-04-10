import React from "react";
import {
  Home,
  LayoutGrid,
  BookOpen,
  GraduationCap,
  Users,
  Megaphone,
  Library,
  LifeBuoy,
} from "lucide-react";
import "./Sidebar.css";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  courseName: string;
}

const NAV_ITEMS = [
  { id: "home", l: "Home", i: Home },
  { id: "modules", l: "Modules", i: LayoutGrid },
  { id: "learn", l: "Course Content", i: BookOpen },
  { id: "grades", l: "Your Grades", i: GraduationCap },
  { id: "people", l: "People", i: Users },
  { id: "ann", l: "Announcements", i: Megaphone, c: 5 },
  { id: "flash", l: "Flashcards", i: Library },
  { id: "support", l: "Support", i: LifeBuoy },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  courseName,
}) => {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "block" : "hidden"}`}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`sidebar ${isOpen ? "translate-x-0" : ""} `}
      >
        
        <div className="sidebar-header p-[0.8rem_0.9rem_0.6rem] border-b border-[#E5DDD4]">
          <div className="sidebar-subtitle text-[0.55rem] font-bold uppercase tracking-[0.06em] text-[#9597A6]">
            Course Overview
          </div>
          <div
            className="sidebar-title"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {courseName}
          </div>
        </div>
        <div className="sidebar-nav">
          {NAV_ITEMS.map((n) => {
            const Icon = n.i;
            const isActive = activeTab === n.id;
            return (
              <div
                key={n.id}
                className={`sidebar-item ${
                  isActive
                    ? "active"
                    : " "
                }`}
                onClick={() => {
                  setActiveTab(n.id);
                  setIsOpen(false);
                }}
              >
                <Icon
                  className={`sidebar-icon  ${isActive ? "opacity-100" : ""}`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span className="flex-1">{n.l}</span>
                {n.c && (
                  <span className="sidebar-badge">
                    {n.c}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="sidebar-footer">
          MokshPath © 2026
        </div>
      </div>
    </>
  );
};
