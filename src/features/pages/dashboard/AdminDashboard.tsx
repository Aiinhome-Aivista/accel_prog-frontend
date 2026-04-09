import React, { useState } from "react";
import LogoIcon from "../../../assets/logogod.svg";
import { useAuth } from "../../../hooks/context/AuthContext";
import { useToast } from "../../../utils/ToastContext";
import { useNavigate } from "react-router-dom";
import { Home, PlusSquare, FileQuestion } from "lucide-react";
import CreateContent from "../../../components/shared/CreateContent";
import CreateQuestion from "../../../components/shared/CreateQuestion";

interface DashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const [navOpen, setNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "home" | "create-content" | "create-question"
  >("home");

  const [contentTitle, setContentTitle] = useState("");
  const [editorContent, setEditorContent] = useState("<p></p>");

  const handleSaveContent = () => {
    const payload = {
      title: contentTitle,
      content: editorContent,
    };

    console.log("Saved content payload:", payload);
    showSuccess("Saved", "Content saved successfully.");
  };

  const handleClearContent = () => {
    setContentTitle("");
    setEditorContent("<p></p>");
  };

  const sidebarItemClass = (
    tab: "home" | "create-content" | "create-question"
  ) =>
    `w-full flex items-center gap-3 px-4 py-3 text-left text-[0.9rem] border-l-[3px] transition-all ${
      activeTab === tab
        ? "bg-[#E87A2E]/10 text-[#E87A2E] border-l-[#E87A2E] font-semibold"
        : "text-[#6B6D7B] border-l-transparent hover:bg-[#F9F5F0] hover:text-[#2B2D42]"
    }`;

  return (
    <div className="min-h-screen bg-[#F3EDE7] text-[#2B2D42] font-sans flex flex-col">
      {/* Top Nav */}
<nav className="fixed top-0 left-0 w-full bg-white border-b border-[#E5DDD4] px-6 h-[60px] flex items-center justify-between z-50 shadow-[0_2px_8px_rgba(43,45,66,.06)]">        <button
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

        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-[#2B2D42] hidden sm:block">
            {user?.name || "Admin"}
          </span>

          <button
            type="button"
            className="w-[34px] h-[34px] rounded-full bg-[#E87A2E]/10 flex items-center justify-center text-[12px] font-bold text-[#E87A2E] cursor-pointer border-none"
            onClick={onLogout}
            title="Click to Sign Out"
          >
            {user?.name?.[0]?.toUpperCase() || "A"}
          </button>

          <button
            type="button"
            className="md:hidden p-1 flex flex-col gap-1 cursor-pointer bg-transparent border-none"
            onClick={() => setNavOpen((prev) => !prev)}
            aria-label="Toggle sidebar"
          >
            <span className="block w-[18px] h-[2px] bg-[#2B2D42]"></span>
            <span className="block w-[18px] h-[2px] bg-[#2B2D42]"></span>
            <span className="block w-[18px] h-[2px] bg-[#2B2D42]"></span>
          </button>
        </div>
      </nav>

      {/* Layout */}
      <div className="flex flex-1 relative pt-[60px]">
        {navOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setNavOpen(false)}
          />
        )}

        {/* Sidebar */}
<aside
  className={`fixed top-[60px] left-0 h-[calc(100vh-60px)] w-[220px] bg-white border-r border-[#E5DDD4] z-50 transition-transform overflow-y-auto ${
    navOpen ? "translate-x-0" : "-translate-x-full"
  } md:translate-x-0`}
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
                setActiveTab("home");
                setNavOpen(false);
              }}
              className={sidebarItemClass("home")}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("create-content");
                setNavOpen(false);
              }}
              className={sidebarItemClass("create-content")}
            >
              <PlusSquare className="w-4 h-4" />
              <span>Create Content</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("create-question");
                setNavOpen(false);
              }}
              className={sidebarItemClass("create-question")}
            >
              <FileQuestion className="w-4 h-4" />
              <span>Create Question</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8 pb-16 md:ml-[220px]">
          <div className="max-w-[1060px] w-full mx-auto">
            {activeTab === "home" && (
              <>
                <div className="mb-8">
                  <h1 className="font-serif text-[clamp(1.4rem,2.5vw,1.8rem)] text-[#2B2D42] mb-2">
                    Welcome back, {user?.name || "Admin"}!
                  </h1>
                  <p className="text-[13.5px] text-[#6B6D7B] leading-relaxed">
                    Manage your platform from the admin dashboard.
                  </p>
                </div>
              </>
            )}

            {activeTab === "create-content" && <CreateContent />}

            {activeTab === "create-question" && <CreateQuestion />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;