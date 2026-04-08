import React, { useState } from "react";
import LogoIcon from "../../../assets/logogod.svg";
import { useAuth } from "../../../hooks/context/AuthContext";
import { useToast } from "../../../utils/ToastContext";
import { useNavigate } from "react-router-dom";
import dashboardData from "./dashboardData.json";
import { PlusSquare } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("create-content");

  return (
    <div className="min-h-screen bg-[#F3EDE7] text-[#2B2D42] font-sans flex flex-col">
      {/* Top Nav */}
      <nav className="bg-white border-b border-[#E5DDD4] px-6 h-[60px] flex items-center justify-between sticky top-0 z-50 shadow-[0_2px_8px_rgba(43,45,66,.06)]">
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer"
            onClick={() => navigate("/admin/admin-dashboard")}
          >
            <img
              src={LogoIcon}
              className="w-[30px] h-[30px] object-contain"
              alt="MokshPath Logo"
            />
            <span className="font-serif text-[1.1rem] text-[#2B2D42]">
              Moksh<span className="text-[#E87A2E]">Path</span>
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-[#2B2D42] hidden sm:block">
            { "Admin"}
          </span>

          <div
            className="w-[34px] h-[34px] rounded-full bg-[#E87A2E]/10 flex items-center justify-center text-[12px] font-bold text-[#E87A2E] cursor-pointer"
            onClick={onLogout}
            title="Click to Sign Out"
          >
            {user?.name?.[0].toUpperCase() || "A"}
          </div>

          <button
            className="md:hidden p-1 flex flex-col gap-1 cursor-pointer bg-transparent border-none"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle sidebar"
          >
            <span className="block w-[18px] h-[2px] bg-[#2B2D42]"></span>
            <span className="block w-[18px] h-[2px] bg-[#2B2D42]"></span>
            <span className="block w-[18px] h-[2px] bg-[#2B2D42]"></span>
          </button>
        </div>
      </nav>

      {/* Page Layout */}
      <div className="flex flex-1 relative">
        {/* Mobile Overlay */}
        {navOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setNavOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:static top-[60px] left-0 h-[calc(100vh-60px)] md:h-auto w-[220px] bg-white border-r border-[#E5DDD4] z-50 transition-transform ${
            navOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="p-4 border-b border-[#E5DDD4]">
            <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[#9597A6]">
              Admin Panel
            </h2>
            <p className="text-[0.95rem] font-serif text-[#2B2D42] mt-1">
              Dashboard
            </p>
          </div>

          <div className="py-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("create-content");
                setNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left text-[0.9rem] border-l-[3px] transition-all ${
                activeTab === "create-content"
                  ? "bg-[#E87A2E]/10 text-[#E87A2E] border-l-[#E87A2E] font-semibold"
                  : "text-[#6B6D7B] border-l-transparent hover:bg-[#F9F5F0] hover:text-[#2B2D42]"
              }`}
            >
              <PlusSquare className="w-4 h-4" />
              <span>Create Content</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8 pb-16 md:ml-0">
          <div className="max-w-[1060px] w-full mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-serif text-[clamp(1.4rem,2.5vw,1.8rem)] text-[#2B2D42] mb-1">
                  {typedDashboardData.welcome.title}, {"Admin"}!
                </h1>
                <p className="text-[13.5px] text-[#6B6D7B] leading-relaxed">
                  Manage your platform content from here.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[16px] border border-[#E5DDD4] p-6 shadow-[0_2px_8px_rgba(43,45,66,.04)]">
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;