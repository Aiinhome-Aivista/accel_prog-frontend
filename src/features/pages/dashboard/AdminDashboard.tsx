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

const AdminDashboard: React.FC<DashboardProps> = ({ onLogout }) => {
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
          </div>
        </div>
        <div className="flex items-center gap-3">
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
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-[1060px] w-full mx-auto px-6 py-8 pb-16 flex-1">
        {/* Welcome */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-[clamp(1.4rem,2.5vw,1.8rem)] text-[#2B2D42] mb-1">
              {typedDashboardData.welcome.title}!
            </h1>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;