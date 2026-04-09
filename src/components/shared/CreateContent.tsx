import React, { useMemo, useRef, useState } from "react";
import { useToast } from "../../utils/ToastContext";
import { courseService } from "../../services/courseService";
import TiptapEditor from "./TipTapEditor";
import { useEffect } from "react";
import SearchableDropdown from "./SearchableDropdown";
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

// Define ContentItem type here or import it from a shared location if available
interface ContentItem {
  content_id: number;
  course_id: number;
  module_id: number;
  subtopic_id: number;
  course_name: string;
  module_name: string;
  subtopic_title: string;
  type: string;
  content: string;
  mediaFileName: string | null;
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
  content: string;
  mediaFileName: string | null;
  // Add other fields that CreateContent might need to pre-fill
}

interface DropdownType {
  type: string;
}

interface CreateContentProps {
  contentToEdit: ContentItem | null;
  onOperationComplete: () => void; // Callback to notify AdminDashboard when done
}

interface SaveContentPayload {
  course_id: number | undefined;
  module_id: number | undefined;
  subtopic_id: number | undefined;
  subtopic_type: SubtopicType | "";
  content: string;
  mediaFileName: string | null;
  created_by: number;
}

const CreateContent: React.FC<CreateContentProps> = ({ contentToEdit, onOperationComplete }) => {
  const { showSuccess, showError } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [allCourses, setAllCourses] = useState<DropdownCourse[]>([]);
  const [allModules, setAllModules] = useState<DropdownModule[]>([]);
  const [allSubtopics, setAllSubtopics] = useState<DropdownSubtopic[]>([]);
  const [allSubtopicTypes, setAllSubtopicTypes] = useState<DropdownType[]>([]);

  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);
  const [courseName, setCourseName] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [subtopicType, setSubtopicType] = useState<SubtopicType | "">("");
  const [editorContent, setEditorContent] = useState("<p></p>");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [videoSource, setVideoSource] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoadingDropdowns(true);
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
        setLoadingDropdowns(false);
      }
    };

    fetchDropdownData();
  }, []);

  const resetForm = () => {
    setCourseName("");
    setModuleName("");
    setSubtopic("");
    setSubtopicType("");
    setVideoSource("");
    setEditorContent("<p></p>");
    setMediaFile(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Effect to populate form when contentToEdit changes
  useEffect(() => {
    if (contentToEdit) {
      setCourseName(contentToEdit.course_name);
      setModuleName(contentToEdit.module_name);
      setSubtopic(contentToEdit.subtopic_title);
      setSubtopicType(contentToEdit.type as SubtopicType);
      setEditorContent(contentToEdit.content);
      setMediaFile(null); // Clear file input for edit, user can re-upload if needed
      setVideoSource(contentToEdit.type === "Video" ? (contentToEdit.mediaFileName ? "Upload" : "Embed") : ""); // Infer video source
    } else {
      resetForm();
    }
  }, [contentToEdit]); // Rerun when contentToEdit prop changes

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
    onOperationComplete(); // Notify parent that operation is complete (e.g., go back to manage content)
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

    // Video specific validation
    if (subtopicType === "Video") {
      if (!videoSource) {
        nextErrors.videoSource = "Video Source is required for Video type.";
      } else if (videoSource === "Upload" && !mediaFile && !contentToEdit?.mediaFileName) {
        // If editing and there's an existing mediaFileName, it's fine. Otherwise, require new upload.
        nextErrors.mediaFile = "Media upload is required for 'Upload' source.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Find IDs for the selected names
    const selectedCourseId = allCourses.find(c => c.course_name === courseName)?.course_id;
    const selectedModuleId = allModules.find(m => m.module_name === moduleName && m.course_id === selectedCourseId)?.module_id;
    const selectedSubtopicId = allSubtopics.find(s => s.title === subtopic && s.module_id === selectedModuleId)?.subtopic_id;

    const payload: SaveContentPayload = {
      course_id: selectedCourseId,
      module_id: selectedModuleId,
      subtopic_id: selectedSubtopicId,
      subtopic_type: subtopicType,
      content: editorContent,
      mediaFileName: mediaFile?.name ?? contentToEdit?.mediaFileName ?? null, // Keep existing filename if not re-uploaded
      created_by: 1, // Binding the created_by field as per the request
      // Add videoSource to payload if needed by backend
      // video_source: videoSource,
    };

    try {
      let response;
      if (contentToEdit) {
        response = await courseService.updateContent({ ...payload, content_id: contentToEdit.content_id });
      } else {
        response = await courseService.saveContent(payload);
      }
      if (response.status === "success") {
        showSuccess("Content Saved", `Content ${contentToEdit ? "updated" : "submitted"} successfully!`);
        onOperationComplete(); // Notify parent to go back to manage content
      } else {
        showError("Submission Failed", response.message || `Failed to ${contentToEdit ? "update" : "save"} content.`);
      }
    } catch (err: any) {
      console.error("Error saving content:", err);
      showError("Submission Error", err.message || "An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingDropdowns) {
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
          {contentToEdit ? "Edit Content" : "Create Content"}
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
          label="Module Name"
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
          {subtopicType === "Video" && videoSource === "Upload" ? (
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
        {/* Display existing media file name if editing and no new file selected */}
        {!mediaFile && contentToEdit?.mediaFileName && (
          <p className="mt-2 text-[12px] text-[#6B6D7B]">
            Existing file: <span className="font-medium">{contentToEdit.mediaFileName}</span>
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
          disabled={isSubmitting}
        >
          {isSubmitting ? (contentToEdit ? "Updating..." : "Submitting...") : (contentToEdit ? "Update Content" : "Submit")}
        </button>
      </div>
    </form>
  );
};

export default CreateContent;
