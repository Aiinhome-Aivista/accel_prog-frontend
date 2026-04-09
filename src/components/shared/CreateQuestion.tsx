import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react"; // Icons for the UI
import { useToast } from "../../utils/ToastContext";
import { courseService } from "../../services/courseService";
import { useAuth } from "../../hooks/context/AuthContext";
import SearchableDropdown from "./SearchableDropdown";


// --- Types ---

/** --- Types --- **/
type QuestionType = "text_area" | "multiple_choice";

interface Question {
  id: string;
  type: QuestionType;
  question_text: string;
  options?: string[];
  placeholder?: string;
}

interface Section {
  id: string;
  section_title: string;
  questions: Question[];
}

interface DropdownCourse {
  course_id: number;
  course_name: string;
}

interface DropdownModule {
  course_id: number;
  module_id: number;
  module_name: string;
}

interface DropdownSubtopic {
  module_id: number;
  subtopic_id: number;
  title: string;
  type: string;
}

interface DropdownType {
  type: string;
}

const CreateQuestion: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  // Existing Dropdown States
  const [allCourses, setAllCourses] = useState<DropdownCourse[]>([]);
  const [allModules, setAllModules] = useState<DropdownModule[]>([]);
  const [allSubtopics, setAllSubtopics] = useState<DropdownSubtopic[]>([]);
  const [allSubtopicTypes, setAllSubtopicTypes] = useState<DropdownType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);

  // Form Field States
  const [courseName, setCourseName] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [subtopicType, setSubtopicType] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- NEW: Question Paper State ---
  const [sections, setSections] = useState<Section[]>([
    { id: "sec_1", section_title: "Problem Solving", questions: [] }
  ]);

  // Load Data
  useEffect(() => {
    courseService.getContentDropdownData().then(res => {
      if (res.status === "success" && res.data) {
        setAllCourses(res.data.courses);
        setAllModules(res.data.modules);
        setAllSubtopics(res.data.subtopics);
        setAllSubtopicTypes(res.data.types);
      } else {
        showError("Error", res.message || "Failed to fetch dropdown data.");
      }
      setLoading(false);
    });
  }, []);

  const selectedCourseData = useMemo(
    () => allCourses.find((course) => course.course_name === courseName),
    [allCourses, courseName],
  );

  const moduleOptions = useMemo(() => {
    if (!selectedCourseData) return allModules.map((module) => module.module_name);
    return allModules
      .filter((module) => module.course_id === selectedCourseData.course_id)
      .map((module) => module.module_name);
  }, [allModules, selectedCourseData]);

  const selectedModuleData = useMemo(
    () =>
      allModules.find(
        (module) =>
          module.module_name === moduleName &&
          module.course_id === selectedCourseData?.course_id,
      ),
    [allModules, moduleName, selectedCourseData],
  );

  const subtopicOptions = useMemo(() => {
    if (!selectedModuleData) return allSubtopics.map((sub) => sub.title);
    return allSubtopics
      .filter((sub) => sub.module_id === selectedModuleData.module_id)
      .map((sub) => sub.title);
  }, [allSubtopics, selectedModuleData]);

  const subtopicTypeOptions = useMemo(() => {
    return allSubtopicTypes.map(type => type.type);
  }, [allSubtopicTypes]);

  const handleCourseChange = (value: string) => {
    setCourseName(value);
    setModuleName("");
    setSubtopic("");
  };

  const handleModuleChange = (value: string) => {
    setModuleName(value);
    setSubtopic("");
  };

  // --- Helpers for Question Builder ---
  const addSection = () => {
    setSections([...sections, { id: `sec_${Date.now()}`, section_title: "", questions: [] }]);
  };

  const removeSection = (sId: string) => {
    setSections(sections.filter(s => s.id !== sId));
  };

  const addQuestion = (sId: string, type: QuestionType) => {
    setSections(sections.map(s => {
      if (s.id === sId) {
        const newQ: Question = {
          id: `q_${Date.now()}`,
          type,
          question_text: "",
          ...(type === "multiple_choice" ? { options: ["", ""] } : { placeholder: "Write your answer..." })
        };
        return { ...s, questions: [...s.questions, newQ] };
      }
      return s;
    }));
  };

  const updateQuestion = (sId: string, qId: string, field: string, value: any) => {
    setSections(sections.map(s => {
      if (s.id === sId) {
        return {
          ...s,
          questions: s.questions.map(q => q.id === qId ? { ...q, [field]: value } : q)
        };
      }
      return s;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate basic fields
    if (!courseName || !subtopicType) {
      showError("Validation Error", "Please fill required dropdowns");
      return;
    }

    const selectedCourseId = allCourses.find(c => c.course_name === courseName)?.course_id;
    const selectedModuleId = allModules.find(m => m.module_name === moduleName && m.course_id === selectedCourseId)?.module_id;
    const selectedSubtopicId = allSubtopics.find(s => s.title === subtopic && s.module_id === selectedModuleId)?.subtopic_id;

    const payload = {
      course_id: selectedCourseId,
      module_id: selectedModuleId,
      subtopic_id: selectedSubtopicId,
      subtopic_type: subtopicType,
      created_by: user?.id || 1,
      content: { sections } // Sending structured JSON
    };

    console.log("Final Payload:", payload);
    showSuccess("Success", "Question paper submitted.");
  };

  if (loading) return <div className="p-10 text-center">Loading Data...</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-[#F9F5F0] min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-[#E5DDD4] p-8 shadow-sm">
        
        {/* Top Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <SearchableDropdown label="Course" value={courseName} options={allCourses.map(c => c.course_name)} onChange={handleCourseChange} menuKey="course" openDropdownKey={openDropdownKey} setOpenDropdownKey={setOpenDropdownKey} required placeholder="Select course" />
          <SearchableDropdown label="Module" value={moduleName} options={moduleOptions} onChange={handleModuleChange} menuKey="module" openDropdownKey={openDropdownKey} setOpenDropdownKey={setOpenDropdownKey} required placeholder="Select module" />
          <SearchableDropdown label="Subtopic" value={subtopic} options={subtopicOptions} onChange={setSubtopic} menuKey="subtopic" openDropdownKey={openDropdownKey} setOpenDropdownKey={setOpenDropdownKey} required placeholder="Select subtopic" />
          <SearchableDropdown label="Type" value={subtopicType} options={subtopicTypeOptions} onChange={setSubtopicType} menuKey="type" openDropdownKey={openDropdownKey} setOpenDropdownKey={setOpenDropdownKey} required placeholder="Select type" />
        </div>

        <hr className="mb-8 border-[#E5DDD4]" />

        {/* --- Dynamic Question Builder --- */}
        <div className="space-y-8">
          {sections.map((section, sIndex) => (
            <div key={section.id} className="border border-[#E5DDD4] rounded-xl p-6 bg-white relative">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 flex-1">
                  <GripVertical className="text-gray-400 cursor-move" size={20} />
                  <input
                    className="text-lg font-bold border-b border-transparent hover:border-gray-300 focus:border-[#E87A2E] outline-none w-1/2"
                    value={section.section_title}
                    onChange={(e) => {
                      const newSecs = [...sections];
                      newSecs[sIndex].section_title = e.target.value;
                      setSections(newSecs);
                    }}
                    placeholder="Section Title (e.g. Problem Solving)"
                  />
                </div>
                <button type="button" onClick={() => removeSection(section.id)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Questions within Section */}
              <div className="space-y-6">
                {section.questions.map((q, qIndex) => (
                  <div key={q.id} className="pl-6 border-l-2 border-[#F9F5F0] space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-[#E87A2E] uppercase">
                        {section.section_title} · Q{qIndex + 1}
                      </span>
                    </div>
                    <textarea
                      className="w-full p-3 bg-[#F9F5F0] rounded-lg border-none focus:ring-1 focus:ring-[#E87A2E] outline-none text-sm"
                      rows={2}
                      placeholder="Enter question text..."
                      value={q.question_text}
                      onChange={(e) => updateQuestion(section.id, q.id, "question_text", e.target.value)}
                    />

                    {q.type === "multiple_choice" && (
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {q.options?.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border border-gray-300" />
                            <input
                              className="flex-1 bg-white border border-[#E5DDD4] rounded-md px-3 py-1 text-sm outline-none"
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...(q.options || [])];
                                newOpts[oIdx] = e.target.value;
                                updateQuestion(section.id, q.id, "options", newOpts);
                              }}
                              placeholder={`Option ${oIdx + 1}`}
                            />
                          </div>
                        ))}
                        <button 
                          type="button" 
                          onClick={() => updateQuestion(section.id, q.id, "options", [...(q.options || []), ""])}
                          className="text-xs text-[#E87A2E] font-medium w-fit"
                        >
                          + Add Option
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Question Buttons */}
              <div className="mt-6 flex gap-3 border-t border-[#F9F5F0] pt-4">
                <button type="button" onClick={() => addQuestion(section.id, "multiple_choice")} className="flex items-center gap-2 text-xs font-semibold px-3 py-2 bg-[#F9F5F0] rounded-lg hover:bg-[#E5DDD4]">
                  <Plus size={14} /> Multiple Choice
                </button>
                <button type="button" onClick={() => addQuestion(section.id, "text_area")} className="flex items-center gap-2 text-xs font-semibold px-3 py-2 bg-[#F9F5F0] rounded-lg hover:bg-[#E5DDD4]">
                  <Plus size={14} /> Subjective / Text
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSection}
            className="w-full py-4 border-2 border-dashed border-[#E5DDD4] rounded-xl text-gray-500 font-semibold hover:border-[#E87A2E] hover:text-[#E87A2E] transition-all"
          >
            + Add New Section
          </button>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-[#E5DDD4]">
          <button type="button" className="px-8 py-2.5 rounded-lg border border-[#E5DDD4] text-gray-500 font-bold hover:bg-gray-50">Cancel</button>
          <button type="submit" className="px-12 py-2.5 bg-[#E87A2E] text-white rounded-lg font-bold shadow-lg hover:bg-[#d06a20]">Submit Paper</button>
        </div>
      </div>
    </form>
  );
};

export default CreateQuestion;