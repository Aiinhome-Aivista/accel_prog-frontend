import React, { useEffect, useState, useMemo } from "react";
import { courseService } from "../../services/courseService";
import { useToast } from "../../utils/ToastContext";
import { Edit, Trash2, Search } from "lucide-react";

interface ContentItem {
  content_id: number;
  course_id: number; // Added for CreateContent to use
  module_id: number; // Added for CreateContent to use
  subtopic_id: number; // Added for CreateContent to use
  course_name: string;
  module_name: string;
  subtopic_title: string;
  type: string;
  created_at: string;
  is_active: boolean;
  week: number;
  content: string;
  mediaFileName: string | null; // Added for CreateContent to use
}

interface ManageContentProps {
  setActiveTab: (
    tab: "home" | "create-content" | "create-question" | "manage-content",
  ) => void;
  onEdit: (contentItem: ContentItem) => void; // Callback to pass the item to AdminDashboard
}

const ManageContent: React.FC<ManageContentProps> = ({ setActiveTab, onEdit }) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { showError } = useToast();

  // Function to refresh content list, useful after edit/delete
  const refreshContent = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllContent();
      if (response.status === "success" && Array.isArray(response.data)) {
        setContent(response.data);
      } else {
        showError("Error", response.message || "Failed to fetch content.");
      }
    } catch (err: any) {
      showError("Fetch Error", err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshContent();
  }, [showError]); // Depend on showError to avoid lint warning, though it's stable

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const decodeAndStripHtml = (html: string) => {
    try {
      const txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value.replace(/(<([^>]+)>)/gi, "");
    } catch (e) {
      return html;
    }
  };

  const truncateText = (text: string, length: number) => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  const filteredContent = useMemo(() => {
    if (!searchTerm) return content;
    return content.filter(
      (item) =>
        item.subtopic_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [content, searchTerm]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E87A2E]"></div>
        <p className="text-[0.82rem] text-[#9597A6]">Loading content...</p>
      </div>
    );
  }

  return (
    <div className=" rounded-lg">
      <div className="px-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2">
          <div>
            <h2 className="font-serif text-[1.25rem] text-[#2B2D42] mb-2">
              Manage Content
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("create-content")}
            className="px-5 py-2.5 rounded-lg bg-[#E87A2E] hover:bg-[#D06A20] text-white font-semibold transition-colors"
          >
            Create New Content
          </button>
        </div>

        <div className="mb-2">
          <div className="relative rounded-md shadow-sm w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title, course, etc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#E87A2E] focus:border-[#E87A2E] sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto px-5 rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-[#6B6D7B] uppercase bg-[#F9F5F0]">
            <tr>
              <th scope="col" className="px-6 py-3">Sl. No.</th>
              <th scope="col" className="px-6 py-3">Subtopic Title</th>
              <th scope="col" className="px-6 py-3">Course / Module</th>
              <th scope="col" className="px-6 py-3">Content</th>
              <th scope="col" className="px-6 py-3 text-center">Type</th>
              <th scope="col" className="px-6 py-3">Created At</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContent.map((item, index) => (
              <tr key={item.content_id} className="bg-white border-b border-[#E5DDD4] hover:bg-[#F9F5F0]">
                <td className="px-6 py-4 font-medium text-gray-600">{index + 1}</td>
                <th scope="row" className="px-6 py-4 font-medium text-[#2B2D42] whitespace-nowrap">
                  {item.subtopic_title}
                </th>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{item.course_name}</div>
                  <div className="text-xs text-gray-500">{item.module_name}</div>
                </td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={decodeAndStripHtml(item.content)}>
                  {truncateText(decodeAndStripHtml(item.content), 80)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 capitalize">{item.type.replace("_", " ")}</span>
                </td>
                <td className="px-6 py-4">{formatDate(item.created_at)}</td>
                <td className="px-6 py-4 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onEdit(item)} // Pass the full item for editing
                    className="font-medium text-[#E87A2E] hover:underline"
                    title="Edit Content"
                  >
                    <Edit size={16} />
                  </button>
                  <button className="font-medium text-red-500 hover:underline" title="Delete Content">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredContent.length === 0 && !loading && (
            <div className="text-center py-10">
                <p className="text-gray-500">No content found.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ManageContent;