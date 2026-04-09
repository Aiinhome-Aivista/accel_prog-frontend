import React, { useState, useEffect, useCallback } from "react";
import LogoIcon from "../../../assets/logogod.svg";
import { useAuth } from "../../../hooks/context/AuthContext";
import { useToast } from "../../../utils/ToastContext";
import { useNavigate } from "react-router-dom";
import { Home, FileQuestion, List, BookCopy } from "lucide-react";
import CreateContent from "../../../components/shared/CreateContent";
import CreateQuestion from "../../../components/shared/CreateQuestion";
import ManageContent from "../../../components/shared/ManageContent";
import ManageQuestion from "../../../components/shared/ManageQuestion";

// Define ContentItem type here or import it if it's in a shared file
interface ContentItem {
  content_id: number;
  course_id: number;
  module_id: number;
  subtopic_id: number;
  course_name: string;
  module_name: string;
  subtopic_title: string;
  type: string; // This is subtopic_type
  content: string;
  mediaFileName: string | null;
}

interface QuestionPaperItem {
  question_paper_id: number;
  course_id: number;
  module_id: number;
  subtopic_id: number;
  course_name: string;
  module_name: string;
  subtopic_title: string;
  type: string;
  content: string;
}

interface QuestionPaperGroup {
  course_name: string;
  module_name: string;
  subtopic_title: string;
  subtopic_id: number;
  questions: any[];
}

interface DashboardProps {
  onLogout: () => void;
}

type AdminTab = "home" | "create-content" | "create-question" | "manage-content" | "manage-question";

const AdminDashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const getTabFromHash = useCallback((): AdminTab => {
    const hash = window.location.hash.substring(1);
    if (["home", "create-content", "create-question", "manage-content", "manage-question"].includes(hash)) {
      return hash as AdminTab;
    }
    return "home";
  }, []);

  const [navOpen, setNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>(getTabFromHash());
  // New state to hold the content item being edited
  const [contentToEdit, setContentToEdit] = useState<ContentItem | null>(null);
  const [questionToEdit, setQuestionToEdit] = useState<QuestionPaperGroup | null>(null);

  // Update URL when activeTab state changes
  useEffect(() => {
    const currentHash = window.location.hash.substring(1);
    if (activeTab !== currentHash && ["home", "create-content", "create-question", "manage-content", "manage-question"].includes(activeTab)) {
      window.location.hash = activeTab;
    }
  }, [activeTab]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(getTabFromHash());
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [getTabFromHash]);

  const handleTabChange = (
    tab: AdminTab,
    itemToEdit: ContentItem | QuestionPaperGroup | null = null // Optional parameter for editing
  ) => {
    setActiveTab(tab);
    setNavOpen(false); // Close sidebar on mobile
    if (tab === "create-content") {
      setContentToEdit(itemToEdit as ContentItem | null);
    } else if (tab === "create-question") {
      setQuestionToEdit(itemToEdit as QuestionPaperGroup | null);
    } else {
      setContentToEdit(null); // Clear edit state when switching to other tabs
      setQuestionToEdit(null);
    }
  };

  const sidebarItemClass = (
    tab: AdminTab
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

            {/* <button
              type="button"
              onClick={() => handleTabChange("create-content")}
              className={sidebarItemClass("create-content")}
            >
              <PlusSquare className="w-4 h-4" />
              <span>Create Content</span>
            </button> */}



            <button
              type="button"
              onClick={() => handleTabChange("manage-content")}
              className={sidebarItemClass("manage-content")}
            >
              <List className="w-4 h-4" />
              <span>Manage Content</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("manage-question")}
              className={sidebarItemClass("manage-question")}
            >
              <BookCopy className="w-4 h-4" />
              <span>Manage Questions</span>
            </button>

            {/* <button
              type="button"
              onClick={() => handleTabChange("create-question")}
              className={sidebarItemClass("create-question")}
            >
              <FileQuestion className="w-4 h-4" />
              <span>Create Question</span>
            </button> */}

          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 py-8 pb-16 md:ml-[220px] ${
            activeTab === "manage-content" || activeTab === "manage-question" ? "" : "px-6"
          }`}
        >
          <div
            className={`${activeTab !== "manage-content" && activeTab !== "manage-question" ? "max-w-[1060px]" : ""} w-full mx-auto`}
          >
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

            {activeTab === "create-content" && (
              <CreateContent
                contentToEdit={contentToEdit}
                onOperationComplete={() => {
                  setContentToEdit(null);
                  handleTabChange("manage-content");
                }}
              />
            )}

            {activeTab === "create-question" && (
              <CreateQuestion
                questionToEdit={questionToEdit}
                onCancel={() => {
                  setQuestionToEdit(null); // Clear edit state after operation
                  handleTabChange("manage-question"); // Go back to manage questions
                }}
              />
            )}

            {activeTab === "manage-content" && (
              <ManageContent
                setActiveTab={(tab) => handleTabChange(tab)}
                onEdit={(item) => handleTabChange("create-content", item)}
              />
            )}

            {activeTab === "manage-question" && (
              <ManageQuestion
                setActiveTab={(tab) => handleTabChange(tab)}
                onEdit={(item) => handleTabChange("create-question", item)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;