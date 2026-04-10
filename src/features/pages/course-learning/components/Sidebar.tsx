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
        <div className="sidebar-header">
          <div className="sidebar-subtitle">
            Course 1 · Foundation
          </div>
          <div
            className="sidebar-title"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            The AI Consumer & Builder
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
