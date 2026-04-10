import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Trash2, GripVertical, Loader2 } from "lucide-react";
import { useToast } from "../../utils/ToastContext";
import { courseService } from "../../services/courseService";
import { useAuth } from "../../hooks/context/AuthContext";
import SearchableDropdown from "./SearchableDropdown";

/** --- Types --- **/
type QuestionType = "text_area" | "multiple_choice";

interface Question {
  id: string;
  db_id?: number; 
  type: QuestionType;
  question_text: string;
  options?: string[];
  correct_answer: string[] | null;
  marks: number;
  category_id?: number;
}

interface Section {
  id: string;
  section_title: string;
  questions: Question[];
}

interface CreateQuestionProps {
  questionToEdit?: any | null; 
  onCancel: () => void; 
}

const CreateQuestion: React.FC<CreateQuestionProps> = ({ questionToEdit, onCancel }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [allModules, setAllModules] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [allSubtopics, setAllSubtopics] = useState<any[]>([]);
  const [allSubtopicTypes, setAllSubtopicTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);

  const [courseName, setCourseName] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [subtopicIdForNewAssessment, setSubtopicIdForNewAssessment] = useState<number | undefined>(undefined);
  const [subtopicType, setSubtopicType] = useState("");
  const [sections, setSections] = useState<Section[]>([
    { id: "sec_1", section_title: "Problem Solving", questions: [] }
  ]);

  useEffect(() => {
    courseService.getContentDropdownData().then(res => {
      if (res.status === "success" && res.data) {
        setAllCourses(res.data.courses);
        setAllModules(res.data.modules);
        setAllSubtopics(res.data.subtopics);
        setAllSubtopicTypes(res.data.types);
        setAllCategories(res.data.categories || []);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (questionToEdit && !loading) {
      setCourseName(questionToEdit.course_name || "");
      setModuleName(questionToEdit.module_name || "");
      setSubtopic(questionToEdit.subtopic_title || "");
      setSubtopicIdForNewAssessment(questionToEdit.subtopic_id);
      setSubtopicType("assessment");

      const grouped: Record<string, Section> = {};
      questionToEdit.questions.forEach((q: any) => {
        const catName = q.category_name || "General";
        if (!grouped[catName]) {
          grouped[catName] = { id: `sec_${Date.now()}_${catName}`, section_title: catName, questions: [] };
        }
        grouped[catName].questions.push({
          id: `q_${q.question_id}`,
          db_id: q.question_id,
          type: q.type_id === 1 ? "multiple_choice" : "text_area",
          question_text: q.question_text,
          options: q.options || [],
          correct_answer: q.correct_answer || [],
          marks: q.marks,
          category_id: q.category_id,
        });
      });
      setSections(Object.values(grouped));
    }
  }, [questionToEdit, loading]);


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

  // const subtopicTypeOptions = useMemo(() => {
  //   return allSubtopicTypes.map(type => type.type);
  // }, [allSubtopicTypes]);


  const handleSubtopicChange = (value: string) => {
    setSubtopic(value);
    const id = allSubtopics.find(s => s.title === value)?.subtopic_id;
    setSubtopicIdForNewAssessment(id);
  };

  const addQuestion = (sId: string, type: QuestionType) => {
    setSections(sections.map(s => s.id === sId ? {
      ...s, questions: [...s.questions, { id: `q_${Date.now()}`, type, question_text: "", options: type === "multiple_choice" ? ["", ""] : undefined, correct_answer: null, marks: 1 }]
    } : s));
  };

  const updateQuestion = useCallback((sId: string, qId: string, field: string, value: any, optIdx?: number) => {
    setSections(prev => prev.map(s => s.id === sId ? {
      ...s, questions: s.questions.map(q => {
        if (q.id === qId) {
          if (field === 'option_text' && q.options && optIdx !== undefined) {
            const newOpts = [...q.options]; newOpts[optIdx] = value; return { ...q, options: newOpts };
          }
          return { ...q, [field]: value };
        }
        return q;
      })
    } : s));
  }, []);

  /** --- FIXED SUBMIT LOGIC --- **/
/** --- UPDATED SUBMIT LOGIC --- **/
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const cId = allCourses.find(c => c.course_name === courseName)?.course_id;
  const mId = allModules.find(m => m.module_name === moduleName)?.module_id;
  const sId = questionToEdit?.subtopic_id || subtopicIdForNewAssessment;

  if (!cId || !mId || !sId) return showError("Error", "Required IDs missing.");

  setIsSubmitting(true);

  const questionList = sections.flatMap((section) => {
    const category = allCategories.find(cat => cat.category_name === section.section_title);
    
    return section.questions.map((q, idx) => {
      const isMcq = q.type === "multiple_choice";

      return {
        // FIX: Added "as const" or explicit type casting to satisfy the interface
        action: (q.db_id ? "update" : "insert") as "insert" | "update" | "delete", 
        question_id: q.db_id ? Number(q.db_id) : null,
        course_id: Number(cId),
        module_id: Number(mId),
        subtopic_id: Number(sId),
        category_id: Number(q.category_id || category?.category_id ),
        type_id: Number(isMcq ? 1 : 2),
        question_text: String(q.question_text),
        option_a: isMcq ? String(q.options?.[0] || "") : "",
        option_b: isMcq ? String(q.options?.[1] || "") : "",
        option_c: isMcq ? String(q.options?.[2] || "") : "",
        option_d: isMcq ? String(q.options?.[3] || "") : "",
        // Ensure correct_answer is passed as an array
        correct_answer: Array.isArray(q.correct_answer) ? q.correct_answer : [String(q.correct_answer || "")]
      };
    });
  });

  try {
    // This will now pass the type check
    const response = await courseService.manageQuestions({ questions: questionList });
    if (response.status === "success") {
      showSuccess("Success", questionToEdit ? "Assessment updated successfully." : "Assessment created successfully.");
      onCancel();
    } else {
      showError("Error", response.message);
    }
  } catch (err: any) {
    showError("Data Error", "Parameter mismatch. Please check 13-argument procedure signature.");
  } finally {
    setIsSubmitting(false);
  }
};

/** --- UPDATED BUTTON RENDER --- **/
// Replace the footer buttons in your return statement with this:
<div className="flex justify-between items-center mt-12 pt-8 border-t border-[#E5DDD4]">
  <button 
    type="button" 
    onClick={onCancel} 
    className="px-8 py-2.5 rounded-lg border border-[#E5DDD4] text-gray-500 font-bold hover:bg-gray-50 transition-colors"
  >
    Cancel
  </button>
  
  <button 
    type="submit" 
    disabled={isSubmitting} 
    className="px-12 py-2.5 bg-[#E87A2E] text-white rounded-lg font-bold shadow-lg hover:bg-[#d06a20] transition-all flex items-center"
  >
    {isSubmitting ? (
      <>
        <Loader2 className="mr-2 animate-spin" size={18} />
        {questionToEdit ? "Updating..." : "Submitting..."}
      </>
    ) : (
      questionToEdit ? "Update Paper" : "Submit Paper"
    )}
  </button>
</div>
  if (loading) return <div className="p-20 text-center text-gray-500">Loading Data...</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-[#F9F5F0] min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-[#E5DDD4] p-8 shadow-sm">
        <h2 className="text-2xl font-serif mb-6">{questionToEdit ? "Edit Assessment" : "Create Assessment"}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <SearchableDropdown label="Course" value={courseName} options={allCourses.map(c => c.course_name)} onChange={(v) => { setCourseName(v); setModuleName(""); }} menuKey="course" openDropdownKey={openDropdownKey} setOpenDropdownKey={setOpenDropdownKey} required placeholder="Select Course" />
          <SearchableDropdown label="Module" value={moduleName} options={moduleOptions} onChange={(v) => { setModuleName(v); setSubtopic(""); }} menuKey="module" openDropdownKey={openDropdownKey} setOpenDropdownKey={setOpenDropdownKey} required placeholder="Select Module" />
          <SearchableDropdown label="Subtopic" value={subtopic} options={subtopicOptions} onChange={handleSubtopicChange} menuKey="subtopic" openDropdownKey={openDropdownKey} setOpenDropdownKey={setOpenDropdownKey} required placeholder="Select Subtopic" />
          <SearchableDropdown label="Type" value={subtopicType} options={["assessment"]} onChange={setSubtopicType} menuKey="type" openDropdownKey={openDropdownKey} setOpenDropdownKey={setOpenDropdownKey} required placeholder="Select Type" />
        </div>

        <hr className="mb-8 border-[#E5DDD4]" />

        <div className="space-y-6">
          {sections.map((section, sIdx) => (
            <div key={section.id} className="border border-[#E5DDD4] rounded-xl bg-white">
              <div className="flex justify-between items-center p-5 border-b border-[#F9F5F0]">
                <div className="flex items-center gap-2 flex-1">
                  <GripVertical className="text-gray-300" size={20} />
                  <input className="font-bold text-lg outline-none w-1/2" value={section.section_title} onChange={(e) => {
                    const next = [...sections]; next[sIdx].section_title = e.target.value; setSections(next);
                  }} />
                </div>
                <button type="button" onClick={() => setSections(sections.filter(s => s.id !== section.id))} className="text-red-400"><Trash2 size={18} /></button>
              </div>

              <div className="p-6 space-y-8">
                {section.questions.map((q, qIdx) => (
                  <div key={q.id} className="pl-6 border-l-2 border-[#E87A2E]/20 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-[#E87A2E] uppercase">Q{qIdx + 1}</span>
                      <input type="number" className="w-12 border rounded p-1 text-xs" value={q.marks} onChange={(e) => updateQuestion(section.id, q.id, "marks", parseInt(e.target.value))} />
                    </div>
                    <textarea className="w-full p-3 bg-[#F9F5F0] rounded-lg text-sm outline-none" rows={2} value={q.question_text} placeholder="Question text..." onChange={(e) => updateQuestion(section.id, q.id, "question_text", e.target.value)} />
                    
                    {q.type === "multiple_choice" && (
                      <div className="space-y-2">
                        {q.options?.map((opt, oIdx) => (
                          <div key={oIdx} className="flex gap-2 items-center">
                            <input 
                              type="checkbox" 
                              title="Mark as correct answer"
                              className="w-4 h-4 cursor-pointer accent-[#E87A2E]"
                              checked={Array.isArray(q.correct_answer) ? q.correct_answer.includes(opt) : false}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                let ans = Array.isArray(q.correct_answer) ? [...q.correct_answer] : [];
                                if (checked && !ans.includes(opt)) {
                                  ans.push(opt);
                                } else if (!checked) {
                                  ans = ans.filter(a => a !== opt);
                                }
                                updateQuestion(section.id, q.id, "correct_answer", ans);
                              }}
                            />
                            <input 
                              className="flex-1 border border-[#E5DDD4] rounded px-3 py-1 text-sm" 
                              value={opt} 
                              onChange={(e) => {
                                const newVal = e.target.value;
                                const oldVal = opt;
                                // Automatically update correct_answer if this option was marked correct
                                let ans = Array.isArray(q.correct_answer) ? [...q.correct_answer] : [];
                                if (ans.includes(oldVal)) {
                                  ans = ans.map(a => a === oldVal ? newVal : a);
                                  updateQuestion(section.id, q.id, "correct_answer", ans);
                                }
                                updateQuestion(section.id, q.id, "option_text", newVal, oIdx);
                              }} 
                              placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                            />
                            <button type="button" onClick={() => {
                              // If deleted option was correct, remove it from correct_answers
                              let ans = Array.isArray(q.correct_answer) ? [...q.correct_answer] : [];
                              if (ans.includes(opt)) {
                                ans = ans.filter(a => a !== opt);
                                updateQuestion(section.id, q.id, "correct_answer", ans);
                              }
                              updateQuestion(section.id, q.id, "options", q.options?.filter((_, i) => i !== oIdx));
                            }} className="text-red-300">
                              <Trash2 size={14}/>
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => updateQuestion(section.id, q.id, "options", [...(q.options || []), ""])} className="text-xs text-[#E87A2E]">+ Add Option</button>
                      </div>
                    )}
                    {q.type === "text_area" && (
                      <div className="space-y-2">
                        <textarea 
                          className="w-full p-3 bg-white border border-[#E5DDD4] rounded-lg text-sm outline-none" 
                          rows={2} 
                          value={q.correct_answer?.[0] || ""} 
                          placeholder="Correct Answer (Optional)" 
                          onChange={(e) => updateQuestion(section.id, q.id, "correct_answer", [e.target.value])} 
                        />
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => addQuestion(section.id, "multiple_choice")} className="text-xs font-bold flex items-center gap-1"><Plus size={14}/> MCQ</button>
                  <button type="button" onClick={() => addQuestion(section.id, "text_area")} className="text-xs font-bold flex items-center gap-1"><Plus size={14}/> Subjective</button>
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setSections([...sections, { id: `sec_${Date.now()}`, section_title: "New Section", questions: [] }])} className="w-full py-3 border-2 border-dashed border-[#E5DDD4] text-gray-400 rounded-xl">+ Add Section</button>
        </div>

        <div className="flex justify-between items-center mt-12 pt-8 border-t border-[#E5DDD4]">
          <button type="button" onClick={onCancel} className="px-8 py-2.5 rounded-lg border border-[#E5DDD4] text-gray-500 font-bold hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-12 py-2.5 bg-[#E87A2E] text-white rounded-lg font-bold flex items-center shadow-lg hover:bg-[#d06a20] transition-all">
            {isSubmitting && <Loader2 className="mr-2 animate-spin" size={18} />}
            {isSubmitting ? "Submitting..." : "Submit Paper"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateQuestion;