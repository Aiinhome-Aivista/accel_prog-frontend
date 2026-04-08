import React, { useMemo, useRef, useState } from "react";
import Select, { components, type MenuListProps, type StylesConfig } from "react-select";
import { Search } from "lucide-react";
import { useToast } from "../../utils/ToastContext";
import { courseService } from "../../services/courseService";
import TiptapEditor from "./TipTapEditor";
import { useEffect } from "react";

type SubtopicType =
  | "Lesson"
  | "Announcement"
  | "Assignment"
  | "Quiz"
  | "Notes"
  | "Video"
  | "reading"
  | "discussion"// Typo in backend data, keeping for now
  | "case_study"// Typo in backend data, keeping for now
  | "assessment"
  | "project";

type SelectOption = {
  value: string;
  label: string;
};

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

interface SearchableDropdownProps {
  label: string;
  required?: boolean;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  error?: string;
  menuKey: string;
  openDropdownKey: string | null;
  setOpenDropdownKey: (key: string | null) => void;
}

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
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#F9F5F0" : "#ffffff",
    color: "#2B2D42",
    cursor: "pointer",
    padding: "8px 12px",
  }),
});

const CustomMenuList = (props: MenuListProps<SelectOption, false>) => {
  const { selectProps } = props;

  return (
    <components.MenuList {...props}>
      {/* Search Header inside the dropdown list */}
      <div className="sticky top-0 bg-white z-20 p-2 border-b border-[#E5DDD4]">
        <div className="flex items-center bg-[#F9F5F0] rounded-md px-2.5 py-1.5 border border-[#E5DDD4] focus-within:border-[#E87A2E] transition-colors">
          <Search size={14} className="text-[#9597A6] mr-2 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search..."
            className="w-full bg-transparent border-none outline-none text-[13px] text-[#2B2D42] placeholder-[#9597A6]"
            onMouseDown={(e) => e.stopPropagation()} 
            value={selectProps.inputValue}
            onChange={(e) => selectProps.onInputChange(e.currentTarget.value, { action: "input-change", prevInputValue: selectProps.inputValue })}
          />
        </div>
      </div>
      <div className="py-1">{props.children}</div>
    </components.MenuList>
  );
};

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  required = false,
  value,
  options,
  placeholder,
  onChange,
  error,
  menuKey,
  openDropdownKey,
  setOpenDropdownKey,
}) => {
  const [inputValue, setInputValue] = useState("");

  const selectOptions: SelectOption[] = useMemo(() => 
    options.map((option) => ({
      value: option,
      label: option,
    })), [options]);

  const selectedOption = selectOptions.find((opt) => opt.value === value) ?? null;

  return (
    <div>
      <label className="block text-[12px] font-semibold text-[#6B6D7B] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <Select
        options={selectOptions}
        value={selectedOption}
        menuIsOpen={openDropdownKey === menuKey}
        inputValue={inputValue}
        onMenuOpen={() => setOpenDropdownKey(menuKey)}
        onInputChange={(val) => setInputValue(val)}
        onChange={(option) => {
          onChange(option?.value ?? "");
        }}
        onMenuClose={() => {
          setOpenDropdownKey(null);
          setInputValue("");
        }}
        placeholder={placeholder}
        
        isSearchable={true} 
        // blurInputOnSelect ensures the focus leaves the component after picking an item
        blurInputOnSelect={true}
        components={{ 
          MenuList: CustomMenuList,
          // Hides the search icon/input from the main select box
          Input: () => null, 
        }}
        noOptionsMessage={() => "No matching options"}
        styles={selectStyles(!!error)}
      />

      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  );
};

const CreateContent: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [allCourses, setAllCourses] = useState<DropdownCourse[]>([]);
  const [allModules, setAllModules] = useState<DropdownModule[]>([]);
  const [allSubtopics, setAllSubtopics] = useState<DropdownSubtopic[]>([]);
  const [allSubtopicTypes, setAllSubtopicTypes] = useState<DropdownType[]>([]);

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);
  const [courseName, setCourseName] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [subtopicType, setSubtopicType] = useState<SubtopicType | "">("");
  const [editorContent, setEditorContent] = useState("<p></p>");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await courseService.getContentDropdownData();
        if (response.status === "success" && response.data) {
          const data = response.data;
          setAllCourses(data.courses);
          setAllModules(data.modules);
          setAllSubtopics(data.subtopics);
          setAllSubtopicTypes(data.types);
        } else {
          setFetchError(response.message || "Failed to fetch dropdown data.");
          showError("Error", response.message || "Failed to fetch dropdown data.");
        }
      } catch (err: any) {
        console.error("Error fetching dropdown data:", err);
        setFetchError(err.message || "An unexpected error occurred.");
        showError("Error", err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
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

  const handleCancel = () => {
    setCourseName("");
    setModuleName("");
    setSubtopic("");
    setSubtopicType("");
    setEditorContent("<p></p>");
    setMediaFile(null);
    setErrors({});

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    // Validate Course Name
    const currentCourse = allCourses.find((c) => c.course_name === courseName);
    if (!courseName.trim()) {
      nextErrors.courseName = "Course Name is required.";
    } else if (!currentCourse) {
      nextErrors.courseName = "Please select a valid Course Name.";
    }

    // Validate Module Name
    const currentModule = allModules.find(
      (m) =>
        m.module_name === moduleName &&
        m.course_id === currentCourse?.course_id,
    );
    if (!moduleName.trim()) {
      nextErrors.moduleName = "Module Name is required.";
    } else if (!currentModule) {
      nextErrors.moduleName = "Please select a valid Module Name.";
    }

    // Validate Subtopic
    const currentSubtopic = allSubtopics.find(
      (s) => s.title === subtopic && s.module_id === currentModule?.module_id,
    );
    if (!subtopic.trim()) {
      nextErrors.subtopic = "Subtopic is required.";
    } else if (!currentSubtopic) {
      nextErrors.subtopic = "Please select a valid Subtopic.";
    }

    // Validate Subtopic Type
    const currentSubtopicType = allSubtopicTypes.find(
      (t) => t.type === subtopicType,
    );
    if (!subtopicType.trim()) {
      nextErrors.subtopicType = "Subtopic Type is required.";
    } else if (!currentSubtopicType) {
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

    const selectedCourseId = allCourses.find(c => c.course_name === courseName)?.course_id;
    const selectedModuleId = allModules.find(m => m.module_name === moduleName && m.course_id === selectedCourseId)?.module_id;
    const selectedSubtopicId = allSubtopics.find(s => s.title === subtopic && s.module_id === selectedModuleId)?.subtopic_id;

    const payload = {
      course_id: selectedCourseId,
      module_id: selectedModuleId,
      subtopic_id: selectedSubtopicId,
      subtopic_type: subtopicType,
      content: editorContent,
      mediaFileName: mediaFile?.name ?? null,
    };

    console.log("Create Content Payload:", payload);
    showSuccess("Submitted", "Content submitted successfully.");
    // Here you would typically call an API to save the content
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-600">Loading dropdown data...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex justify-center items-center h-48 text-red-500">
        <p>Error: {fetchError}</p>
      </div>
    );
  }

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
          menuKey="courseName"
          openDropdownKey={openDropdownKey}
          setOpenDropdownKey={setOpenDropdownKey}
          label="Course Name"
          required
          value={courseName}
          options={allCourses.map((course) => course.course_name)}
          placeholder="Select course"
          onChange={handleCourseChange}
          error={errors.courseName}
        />

        <SearchableDropdown
          menuKey="moduleName"
          openDropdownKey={openDropdownKey}
          setOpenDropdownKey={setOpenDropdownKey}
          label="Model Name"
          required
          value={moduleName}
          options={moduleOptions}
          placeholder="Select module"
          onChange={handleModuleChange}
          error={errors.moduleName}
        />

        <SearchableDropdown
          menuKey="subtopic"
          openDropdownKey={openDropdownKey}
          setOpenDropdownKey={setOpenDropdownKey}
          label="Subtopic"
          required
          value={subtopic}
          options={subtopicOptions}
          placeholder="Select subtopic"
          onChange={setSubtopic}
          error={errors.subtopic}
        />

        <SearchableDropdown
          menuKey="subtopicType"
          openDropdownKey={openDropdownKey}
          setOpenDropdownKey={setOpenDropdownKey}
          label="Subtopic Type"
          required
          value={subtopicType}
          options={subtopicTypeOptions}
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
          {subtopicType === "Video"? (
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