import React, { useMemo, useState } from "react";
import TiptapEditor from "./TipTapEditor";
import { useToast } from "../../utils/ToastContext";

type SubtopicType =
  | "Lesson"
  | "Announcement"
  | "Assignment"
  | "Quiz"
  | "Notes";

type CourseOption = {
  id: string;
  label: string;
  modules: string[];
};

const COURSE_OPTIONS: CourseOption[] = [
  {
    id: "ai-consumer-builder",
    label: "The AI Consumer & Builder",
    modules: ["Introduction to AI", "Prompting Basics", "AI Tools in Practice"],
  },
  {
    id: "genai-workflows",
    label: "GenAI Workflows",
    modules: ["Foundations", "Automation", "Deployment"],
  },
  {
    id: "content-systems",
    label: "Content Systems",
    modules: ["Planning", "Authoring", "Publishing"],
  },
];

const SUBTOPIC_OPTIONS: SubtopicType[] = [
  "Lesson",
  "Announcement",
  "Assignment",
  "Quiz",
  "Notes",
];

const CreateContent: React.FC = () => {
  const { showSuccess } = useToast();

  const [courseName, setCourseName] = useState(COURSE_OPTIONS[0].id);
  const [moduleName, setModuleName] = useState(COURSE_OPTIONS[0].modules[0]);
  const [subtopicType, setSubtopicType] = useState<SubtopicType>("Lesson");
  const [contentTitle, setContentTitle] = useState("");
  const [editorContent, setEditorContent] = useState("<p></p>");

  const selectedCourse = useMemo(
    () => COURSE_OPTIONS.find((course) => course.id === courseName),
    [courseName],
  );

  const availableModules = selectedCourse?.modules ?? [];

  const handleCourseChange = (value: string) => {
    const nextCourse =
      COURSE_OPTIONS.find((course) => course.id === value) ?? COURSE_OPTIONS[0];

    setCourseName(nextCourse.id);
    setModuleName(nextCourse.modules[0] ?? "");
  };

  const handleCancel = () => {
    setCourseName(COURSE_OPTIONS[0].id);
    setModuleName(COURSE_OPTIONS[0].modules[0]);
    setSubtopicType("Lesson");
    setContentTitle("");
    setEditorContent("<p></p>");
  };

  // ✅ FORM SUBMIT
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // VERY IMPORTANT

    const payload = {
      courseName,
      moduleName,
      subtopicType,
      contentTitle,
      content: editorContent,
    };

    console.log("Create Content Payload:", payload);

    showSuccess("Submitted", "Content submitted successfully.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-[16px] border border-[#E5DDD4] p-6 shadow-[0_2px_8px_rgba(43,45,66,.04)]"
    >
      <div className="mb-6">
        <h2 className="font-serif text-[1.25rem] text-[#2B2D42] mb-2">
          Create Content
        </h2>
        <p className="text-[13px] text-[#6B6D7B]">
          Select the course, module, and subtopic type, then write your content below.
        </p>
      </div>

      {/* DROPDOWNS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-[12px] font-semibold text-[#6B6D7B] mb-2">
            Course Name
          </label>
          <select
            value={courseName}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="w-full rounded-[12px] border border-[#E5DDD4] px-4 py-3"
          >
            {COURSE_OPTIONS.map((course) => (
              <option key={course.id} value={course.id}>
                {course.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-[#6B6D7B] mb-2">
            Module Name
          </label>
          <select
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            className="w-full rounded-[12px] border border-[#E5DDD4] px-4 py-3"
          >
            {availableModules.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-[#6B6D7B] mb-2">
            Subtopic Type
          </label>
          <select
            value={subtopicType}
            onChange={(e) => setSubtopicType(e.target.value as SubtopicType)}
            className="w-full rounded-[12px] border border-[#E5DDD4] px-4 py-3"
          >
            {SUBTOPIC_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TITLE */}
      <div className="mb-5">
        <label className="block text-[12px] font-semibold mb-2">
          Content Title
        </label>
        <input
          type="text"
          value={contentTitle}
          onChange={(e) => setContentTitle(e.target.value)}
          placeholder="Enter content title"
          required
          className="w-full rounded-[12px] border border-[#E5DDD4] px-4 py-3"
        />
      </div>

      {/* EDITOR */}
      <div className="mb-5">
        <TiptapEditor content={editorContent} onChange={setEditorContent} />
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3">
        {/* ✅ SUBMIT */}
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-[#E87A2E] hover:bg-[#D06A20] text-white font-semibold"
        >
          Submit
        </button>

        {/* ❌ CANCEL */}
        <button
          type="button"
          onClick={handleCancel}
          className="px-5 py-2.5 rounded-lg border border-[#E5DDD4] text-[#6B6D7B] hover:text-[#E87A2E]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateContent;