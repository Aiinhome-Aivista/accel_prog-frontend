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
        className={`fixed inset-0 top-[50px] bg-black/30 z-50 md:hidden transition-opacity ${isOpen ? "block" : "hidden"}`}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`w-[200px] bg-white border-r border-[#E5DDD4] flex flex-col shrink-0 overflow-y-auto transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} fixed md:static top-[50px] h-[calc(100vh-50px)] z-50`}
      >
        <div className="p-[0.8rem_0.9rem_0.6rem] border-b border-[#E5DDD4]">
          <div className="text-[0.55rem] font-bold uppercase tracking-[0.06em] text-[#9597A6]">
            Course Overview
          </div>
          <div
            className="font-['DM_Serif_Display'] text-[0.85rem] text-[#2B2D42] leading-[1.2] font-medium"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {courseName}
          </div>
        </div>
        <div className="flex-1 py-[0.3rem]">
          {NAV_ITEMS.map((n) => {
            const Icon = n.i;
            const isActive = activeTab === n.id;
            return (
              <div
                key={n.id}
                className={`std-sidebar-item ${isActive ? "std-sidebar-item-active" : ""}`}
                onClick={() => {
                  setActiveTab(n.id);
                  setIsOpen(false);
                }}
              >
                <Icon
                  className={`w-[14px] h-[14px] shrink-0 ${isActive ? "opacity-100" : "opacity-50"}`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span className="flex-1">{n.l}</span>
                {n.c && (
                  <span className="ml-auto std-badge" style={{ background: "rgba(232, 122, 46, 0.1)", color: "#E87A2E", padding: "1px 5px", fontSize: "0.55rem" }}>
                    {n.c}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="p-[0.5rem_0.8rem] border-t border-[#E5DDD4] text-[0.6rem] text-[#9597A6] text-center">
          MokshPath © 2026
        </div>
      </div>
    </>
  );
};
