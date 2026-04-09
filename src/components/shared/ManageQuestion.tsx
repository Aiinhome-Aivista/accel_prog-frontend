import React, { useEffect, useState, useMemo } from "react";
import { courseService } from "../../services/courseService";
import { useToast } from "../../utils/ToastContext";
import { Edit, Trash2, Search, FileText } from "lucide-react";

// 1. Updated Interface to match your new JSON structure
interface QuestionItem {
  question_id: number;
  course_id: number;
  module_id: number;
  subtopic_id: number;
  course_name: string;
  module_name: string;
  subtopic_title: string;
  category_name: string;
  question_text: string;
  type_id: number; // 1 for MCQ, 2 for Subjective/Text
  options: string[] | null;
  marks: number;
}


interface ManageQuestionProps {
  setActiveTab: (tab: "home" | "create-content" | "create-question" | "manage-content" | "manage-question") => void;
  onEdit: (group: any) => void;
}

const ManageQuestion: React.FC<ManageQuestionProps> = ({ setActiveTab, onEdit }) => {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { showError } = useToast();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await courseService.getAllQuestions();
        if (response.status === "success" && Array.isArray(response.data)) {
          setQuestions(response.data);
        } else {
          showError("Error", response.message || "Failed to fetch questions.");
        }
      } catch (err: any) {
        showError("Fetch Error", err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [showError]);

  // 2. Grouping Logic: Group individual questions by Assessment (Subtopic)
  const groupedQuestions = useMemo(() => {
    const groups: Record<number, any> = {};

    questions.forEach((q) => {
      if (!groups[q.subtopic_id]) {
        groups[q.subtopic_id] = {
          subtopic_id: q.subtopic_id,
          subtopic_title: q.subtopic_title,
          course_name: q.course_name,
          module_name: q.module_name,
          total_marks: 0,
          question_count: 0,
          categories: new Set(),
          questions: [], // keep the raw questions for editing
        };
      }
      groups[q.subtopic_id].total_marks += q.marks;
      groups[q.subtopic_id].question_count += 1;
      groups[q.subtopic_id].categories.add(q.category_name);
      groups[q.subtopic_id].questions.push(q);
    });

    const result = Object.values(groups);

    if (!searchTerm) return result;

    return result.filter((item: any) =>
      item.subtopic_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.course_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [questions, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E87A2E]"></div>
        <p className="ml-3 text-gray-600">Loading assessments...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#E5DDD4] shadow-sm">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h2 className="font-serif text-[1.25rem] text-[#2B2D42]">Manage Assessments</h2>
          <button
            onClick={() => setActiveTab("create-question")}
            className="px-5 py-2.5 rounded-lg bg-[#E87A2E] hover:bg-[#D06A20] text-white font-semibold transition-colors flex items-center gap-2"
          >
            <FileText size={18} /> Create New Assessment
          </button>
        </div>

        <div className="relative w-full sm:w-72 mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#E87A2E] focus:border-[#E87A2E]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[#6B6D7B] uppercase bg-[#F9F5F0]">
            <tr>
              <th className="px-6 py-3">Sl. No.</th>
              <th className="px-6 py-3">Assessment Title</th>
              <th className="px-6 py-3">Course / Module</th>
              <th className="px-6 py-3 text-center">Stats</th>
              <th className="px-6 py-3">Categories</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groupedQuestions.map((group: any, index) => (
              <tr key={group.subtopic_id} className="bg-white border-b border-[#E5DDD4] hover:bg-[#F9F5F0] transition-colors">
                <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                <td className="px-6 py-4 font-bold text-[#2B2D42]">{group.subtopic_title}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{group.course_name}</div>
                  <div className="text-xs text-gray-500">{group.module_name}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-[#E87A2E] font-bold">{group.question_count} Qs</div>
                  <div className="text-xs text-gray-500">{group.total_marks} Marks</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {Array.from(group.categories).map((cat: any) => (
                      <span key={cat} className="px-2 py-0.5 text-[10px] bg-blue-50 text-blue-600 rounded-md border border-blue-100">
                        {cat}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 flex items-center gap-4">
                  <button 
                    onClick={() => onEdit(group)} 
                    className="p-2 text-[#E87A2E] hover:bg-orange-50 rounded-full transition-colors" 
                    title="Edit Assessment"
                  >
                    <Edit size={18} />
                  </button>
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Delete Assessment">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {groupedQuestions.length === 0 && (
          <div className="text-center py-10 text-gray-500 italic">No assessments found.</div>
        )}
      </div>
    </div>
  );
};

export default ManageQuestion;