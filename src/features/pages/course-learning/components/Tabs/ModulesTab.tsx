import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../../hooks/context/AuthContext";
import { dashboardService } from "../../../../../services/dashboardService";

interface Topic {
  is_completed?: boolean;
  is_locked: boolean;
  subtitle: string | null;
  title: string;
  type: string;
}

interface Day {
  day: number | null;
  topics: Topic[];
}

interface ModuleData {
  days: Day[] | null;
  module_id: number;
  module_name: string;
  project: string | null;
  week: number;
}

const colors = ["#E87A2E", "#4285F4", "#34A853", "#FBBC05"];

export const ModulesTab: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [openMods, setOpenMods] = useState<Record<number, boolean>>({
    0: true,
  });
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      const courseId = searchParams.get("course_id");
      const userId = user?.id;

      if (!courseId || !userId) return;

      try {
        setLoading(true);
        const response = await dashboardService.getModules(courseId, userId);
        if (response.status === "success" && response.data) {
          setModules(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch modules:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, [searchParams, user]);

  const toggleMod = (idx: number) => {
    setOpenMods((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E87A2E]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[860px] mx-auto p-[1rem] md:p-[1.3rem_1.8rem_3rem]">
      <div
        className="font-['DM_Serif_Display'] text-[1.3rem] text-[#2B2D42] mb-[1.2rem] font-medium"
        style={{ fontFamily: '"DM Serif Display", serif' }}
      >
        Modules Overview
      </div>
      <p className="text-[0.8rem] text-[#6B6D7B] mt-[-0.8rem] mb-[1rem] leading-[1.5]">
        All topics across {modules.length} weeks. Click to expand day-by-day
        breakdown.
      </p>

      {modules.map((m, i) => {
        const bgColor = colors[i % colors.length];
        // Check if any topic in this module is unlocked
        const hasUnlocked =
          m.days?.some((d) => d.topics.some((t) => !t.is_locked)) ?? false;

        return (
          <div
            key={i}
            className="bg-white rounded-[14px] border border-[#E5DDD4] mb-[0.8rem] overflow-hidden"
          >
            <div
              className="p-[0.8rem_1rem] flex items-center gap-[0.5rem] cursor-pointer hover:bg-[#F9F5F0] transition-colors"
              onClick={() => toggleMod(i)}
            >
              <div
                className="w-[24px] h-[24px] rounded-full text-[0.65rem] font-bold flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: bgColor }}
              >
                {m.week}
              </div>
              <h3 className="text-[0.85rem] font-bold text-[#2B2D42] flex-1 m-0">
                {m.module_name}
              </h3>
              <span className="text-[0.62rem] text-[#9597A6] font-medium">
                {m.days?.length ? `${m.days.length} Days` : "No Days"}
                {!hasUnlocked ? " · 🔒" : " · 🔓"}
              </span>
            </div>

            {openMods[i] && (
              <div className="px-[1rem] pb-[0.8rem]">
                {!m.days || m.days.length === 0 ? (
                  <div className="text-[0.75rem] text-[#9597A6] py-3 text-center bg-[#F9F5F0] rounded-[8px] italic font-medium">
                    No data found
                  </div>
                ) : (
                  m.days.map((day, dayIdx) => (
                    <div key={dayIdx}>
                      {day.topics.map((tp, idx) => (
                        <div
                          key={idx}
                          className={`flex gap-[0.4rem] p-[0.35rem_0.5rem] rounded-[8px] mb-[0.25rem] text-[0.74rem] leading-[1.4] items-start ${
                            tp.is_completed ? "bg-[#edf7ed] text-[#1e4620]" : "bg-[#F9F5F0] text-[#6B6D7B]"
                          }`}
                        >
                          <span className={`text-[0.62rem] font-bold shrink-0 min-w-[45px] ${
                            tp.is_completed ? "text-[#2e7d32]" : "text-[#E87A2E]"
                          }`}>
                            {day.day ? `Day ${day.day}` : "Topics"}
                          </span>
                          <div>
                            <strong className={tp.is_completed ? "text-[#1e4620]" : "text-[#2B2D42]"}>
                              {tp.title}
                            </strong>
                            {/* {tp.is_locked ? " 🔒" : ""} */}
                            {tp.subtitle && (
                              <>
                                <br />
                                {tp.subtitle}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
                {m.project && (
                  <div className="mt-[0.5rem] p-[0.5rem_0.7rem] bg-[#e87a2e1f] rounded-[8px] text-[0.72rem] text-[#D06A20]">
                    <strong>Project:</strong> {m.project}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
