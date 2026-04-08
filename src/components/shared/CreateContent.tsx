import React, { useMemo, useRef, useState } from "react";
import Select, { type StylesConfig } from "react-select";
import { useToast } from "../../utils/ToastContext";
import TiptapEditor from "./TipTapEditor";

type SubtopicType =
  | "Lesson"
  | "Announcement"
  | "Assignment"
  | "Quiz"
  | "Notes"
  | "Video";

type ModuleOption = {
  id: string;
  label: string;
  subtopics: string[];
};

type CourseOption = {
  id: string;
  label: string;
  modules: ModuleOption[];
};

type SelectOption = {
  value: string;
  label: string;
};

const COURSE_OPTIONS: CourseOption[] = [
  {
    id: "ai-consumer-builder",
    label: "The AI Consumer & Builder",
    modules: [
      {
        id: "intro-ai",
        label: "Introduction to AI",
        subtopics: ["What is AI?", "History of AI", "AI in daily life"],
      },
      {
        id: "prompting-basics",
        label: "Prompting Basics",
        subtopics: [
          "Prompt structure",
          "Zero-shot prompting",
          "Few-shot prompting",
        ],
      },
      {
        id: "ai-tools-practice",
        label: "AI Tools in Practice",
        subtopics: ["Chat tools", "Image tools", "Workflow automation"],
      },
    ],
  },
  {
    id: "genai-workflows",
    label: "GenAI Workflows",
    modules: [
      {
        id: "foundations",
        label: "Foundations",
        subtopics: ["LLM basics", "Embeddings", "Context windows"],
      },
      {
        id: "automation",
        label: "Automation",
        subtopics: ["Task automation", "Agent basics", "Pipeline design"],
      },
      {
        id: "deployment",
        label: "Deployment",
        subtopics: ["Hosting", "Monitoring", "Production readiness"],
      },
    ],
  },
  {
    id: "content-systems",
    label: "Content Systems",
    modules: [
      {
        id: "planning",
        label: "Planning",
        subtopics: [
          "Curriculum design",
          "Content mapping",
          "Audience intent",
        ],
      },
      {
        id: "authoring",
        label: "Authoring",
        subtopics: ["Writing lessons", "Rich media", "Assessment design"],
      },
      {
        id: "publishing",
        label: "Publishing",
        subtopics: ["Versioning", "Release flow", "Content maintenance"],
      },
    ],
  },
];

const SUBTOPIC_TYPE_OPTIONS: SubtopicType[] = [
  "Lesson",
  "Announcement",
  "Assignment",
  "Quiz",
  "Notes",
  "Video",
];

const selectStyles = (
  hasError: boolean,
): StylesConfig<SelectOption, false> => ({
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    borderRadius: "12px",
    borderColor: hasError
      ? "#f87171"
      : state.isFocused
        ? "#E87A2E"
        : "#E5DDD4",
    boxShadow: "none",
    "&:hover": {
      borderColor: hasError ? "#f87171" : "#E87A2E",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 12px",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9597A6",
    fontSize: "14px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#2B2D42",
    fontSize: "14px",
  }),
  input: (base) => ({
    ...base,
    color: "#2B2D42",
    fontSize: "14px",
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: "none",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "12px",
    overflow: "hidden",
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#F9F5F0" : "#ffffff",
    color: "#2B2D42",
    cursor: "pointer",
  }),
});

type SearchableDropdownProps = {
  label: string;
  required?: boolean;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  error?: string;
};

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  required = false,
  value,
  options,
  placeholder,
  onChange,
  error,
}) => {
  const selectOptions: SelectOption[] = options.map((option) => ({
    value: option,
    label: option,
  }));

  const selectedOption =
    selectOptions.find((option) => option.value === value) ?? null;

  return (
    <div>
      <label className="block text-[12px] font-semibold text-[#6B6D7B] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <Select
        options={selectOptions}
        value={selectedOption}
        onChange={(option) => onChange(option?.value ?? "")}
        placeholder={placeholder}
        isSearchable
        openMenuOnFocus
        openMenuOnClick
        noOptionsMessage={() => "No matching options"}
        styles={selectStyles(!!error)}
      />

      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  );
};

const CreateContent: React.FC = () => {
  const { showSuccess } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initialCourse = COURSE_OPTIONS[0];
  const initialModule = initialCourse.modules[0];
  const initialSubtopic = initialModule.subtopics[0];

  const [courseName, setCourseName] = useState(initialCourse.label);
  const [moduleName, setModuleName] = useState(initialModule.label);
  const [subtopic, setSubtopic] = useState(initialSubtopic);
  const [subtopicType, setSubtopicType] = useState<SubtopicType>("Lesson");
  const [editorContent, setEditorContent] = useState("<p></p>");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCourse = useMemo(
    () => COURSE_OPTIONS.find((course) => course.label === courseName) ?? null,
    [courseName],
  );

  const moduleOptions = selectedCourse?.modules.map((module) => module.label) ?? [];

  const selectedModule = useMemo(
    () =>
      selectedCourse?.modules.find((module) => module.label === moduleName) ??
      null,
    [selectedCourse, moduleName],
  );

  const subtopicOptions = selectedModule?.subtopics ?? [];

  const handleCourseChange = (value: string) => {
    setCourseName(value);

    const nextCourse = COURSE_OPTIONS.find((course) => course.label === value);

    if (nextCourse) {
      const firstModule = nextCourse.modules[0];
      setModuleName(firstModule?.label ?? "");
      setSubtopic(firstModule?.subtopics[0] ?? "");
    } else {
      setModuleName("");
      setSubtopic("");
    }
  };

  const handleModuleChange = (value: string) => {
    setModuleName(value);

    const nextModule = selectedCourse?.modules.find(
      (module) => module.label === value,
    );

    if (nextModule) {
      setSubtopic(nextModule.subtopics[0] ?? "");
    } else {
      setSubtopic("");
    }
  };

  const handleCancel = () => {
    setCourseName(initialCourse.label);
    setModuleName(initialModule.label);
    setSubtopic(initialSubtopic);
    setSubtopicType("Lesson");
    setEditorContent("<p></p>");
    setMediaFile(null);
    setErrors({});

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!courseName.trim()) {
      nextErrors.courseName = "Course Name is required.";
    } else if (!COURSE_OPTIONS.some((course) => course.label === courseName)) {
      nextErrors.courseName = "Please select a valid Course Name.";
    }

    if (!moduleName.trim()) {
      nextErrors.moduleName = "Model Name is required.";
    } else if (!moduleOptions.includes(moduleName)) {
      nextErrors.moduleName = "Please select a valid Model Name.";
    }

    if (!subtopic.trim()) {
      nextErrors.subtopic = "Subtopic is required.";
    } else if (!subtopicOptions.includes(subtopic)) {
      nextErrors.subtopic = "Please select a valid Subtopic.";
    }

    if (!subtopicType.trim()) {
      nextErrors.subtopicType = "Subtopic Type is required.";
    } else if (!SUBTOPIC_TYPE_OPTIONS.includes(subtopicType)) {
      nextErrors.subtopicType = "Please select a valid Subtopic Type.";
    }

    const plainText = editorContent.replace(/<[^>]*>/g, "").trim();
    if (!plainText) {
      nextErrors.editorContent = "Content body is required.";
    }

    if (subtopicType === "Video" && !mediaFile) {
      nextErrors.mediaFile = "Media upload is required for Video type.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      courseName,
      moduleName,
      subtopic,
      subtopicType,
      content: editorContent,
      mediaFileName: mediaFile?.name ?? null,
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
          Fill all required fields, write the content, and optionally upload media.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <SearchableDropdown
          label="Course Name"
          required
          value={courseName}
          options={COURSE_OPTIONS.map((course) => course.label)}
          placeholder="Select course"
          onChange={handleCourseChange}
          error={errors.courseName}
        />

        <SearchableDropdown
          label="Model Name"
          required
          value={moduleName}
          options={moduleOptions}
          placeholder="Select model"
          onChange={handleModuleChange}
          error={errors.moduleName}
        />

        <SearchableDropdown
          label="Subtopic"
          required
          value={subtopic}
          options={subtopicOptions}
          placeholder="Select subtopic"
          onChange={setSubtopic}
          error={errors.subtopic}
        />

        <SearchableDropdown
          label="Subtopic Type"
          required
          value={subtopicType}
          options={SUBTOPIC_TYPE_OPTIONS}
          placeholder="Select type"
          onChange={(value) => setSubtopicType(value as SubtopicType)}
          error={errors.subtopicType}
        />
      </div>

      <div className="mb-2">
        <label className="block text-[12px] font-semibold text-[#6B6D7B] mb-2">
          Content Body <span className="text-red-500">*</span>
        </label>
      </div>

      <div className="mb-2">
        <TiptapEditor content={editorContent} onChange={setEditorContent} />
      </div>

      {errors.editorContent && (
        <p className="mb-5 text-[12px] text-red-500">{errors.editorContent}</p>
      )}

      <div className="mb-6">
        <label className="block text-[12px] font-semibold text-[#6B6D7B] mb-2">
          Media Upload{" "}
          {subtopicType === "Video" ? (
            <span className="text-red-500">*</span>
          ) : (
            <span className="text-[#9597A6]">(Optional)</span>
          )}
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx"
          onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
          className={`w-full rounded-[12px] border bg-white px-4 py-3 text-[14px] text-[#2B2D42] outline-none file:mr-4 file:rounded-md file:border-0 file:bg-[#E87A2E]/10 file:px-3 file:py-2 file:text-[#E87A2E] ${
            errors.mediaFile
              ? "border-red-400 focus:border-red-500"
              : "border-[#E5DDD4] focus:border-[#E87A2E]"
          }`}
        />

        {mediaFile && (
          <p className="mt-2 text-[12px] text-[#6B6D7B]">
            Selected file: <span className="font-medium">{mediaFile.name}</span>
          </p>
        )}

        {errors.mediaFile && (
          <p className="mt-1 text-[12px] text-red-500">{errors.mediaFile}</p>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={handleCancel}
          className="px-5 py-2.5 rounded-lg border border-[#E5DDD4] text-[#6B6D7B] hover:text-[#E87A2E] hover:border-[#E87A2E] transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-[#E87A2E] hover:bg-[#D06A20] text-white font-semibold transition-colors"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CreateContent;