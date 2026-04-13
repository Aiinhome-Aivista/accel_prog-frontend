import React, { useMemo, useRef, useState, useEffect } from "react";
import { useToast } from "../../utils/ToastContext";
import { courseService } from "../../services/courseService";
import SearchableDropdown from "./SearchableDropdown";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/context/AuthContext";

interface VideoItem {
  mapping_id: number;
  course_id: number;
  module_id: number | null;
  subtopic_id: number | null;
  video_title: string;
  video_subtitle: string;
  video_path: string;
  thumbnail_path?: string;
  duration_sec: number;
  is_intro_video: boolean;
  course_name?: string;
  module_name?: string | null;
  title?: string | null;
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
}

interface CreateVideoProps {
  videoToEdit: VideoItem | null;
  onOperationComplete: () => void;
}

const CreateVideo: React.FC<CreateVideoProps> = ({ videoToEdit, onOperationComplete }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const [allCourses, setAllCourses] = useState<DropdownCourse[]>([]);
  const [allModules, setAllModules] = useState<DropdownModule[]>([]);
  const [allSubtopics, setAllSubtopics] = useState<DropdownSubtopic[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);
  const [courseName, setCourseName] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [subtopic, setSubtopic] = useState("");
  
  const [videoTitle, setVideoTitle] = useState("");
  const [videoSubtitle, setVideoSubtitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isIntro, setIsIntro] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoadingDropdowns(true);
      try {
        const response = await courseService.getContentDropdownData();
        if (response.status === "success" && response.data) {
          setAllCourses(response.data.courses);
          setAllModules(response.data.modules);
          setAllSubtopics(response.data.subtopics);
        } else {
          showError("Error", response.message || "Failed to fetch dropdown data.");
        }
      } catch (err: any) {
        showError("Error", err.message || "An unexpected error occurred.");
      } finally {
        setLoadingDropdowns(false);
      }
    };
    fetchDropdownData();
  }, [showError]);

  // Form Reset
  const resetForm = () => {
    setCourseName("");
    setModuleName("");
    setSubtopic("");
    setVideoTitle("");
    setVideoSubtitle("");
    setVideoFile(null);
    setIsIntro(false);
    setErrors({});
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  // Pre-fill if editing
  useEffect(() => {
    if (videoToEdit) {
      setCourseName(videoToEdit.course_name || "");
      setModuleName(videoToEdit.module_name || "");
      setSubtopic(videoToEdit.title || "");
      setVideoTitle(videoToEdit.video_title);
      setVideoSubtitle(videoToEdit.video_subtitle);
      setIsIntro(videoToEdit.is_intro_video);
      setVideoFile(null);
    } else {
      resetForm();
    }
  }, [videoToEdit]);

  // Logic: When Intro is checked, nullify Module and Subtopic
  const handleIntroToggle = (checked: boolean) => {
    setIsIntro(checked);
    if (checked) {
      setModuleName("");
      setSubtopic("");
      setErrors((prev) => ({ ...prev, moduleName: "", subtopic: "" }));
    }
  };

  // Dropdown Filtering Logic
  const selectedCourseData = useMemo(() => allCourses.find((c) => c.course_name === courseName), [allCourses, courseName]);
  
  const moduleOptions = useMemo(() => {
    if (!selectedCourseData) return allModules.map((m) => m.module_name);
    return allModules.filter((m) => m.course_id === selectedCourseData.course_id).map((m) => m.module_name);
  }, [allModules, selectedCourseData]);

  const selectedModuleData = useMemo(() => 
    allModules.find((m) => m.module_name === moduleName && m.course_id === selectedCourseData?.course_id), 
  [allModules, moduleName, selectedCourseData]);

  const subtopicOptions = useMemo(() => {
    if (!selectedModuleData) return allSubtopics.map((s) => s.title);
    return allSubtopics.filter((s) => s.module_id === selectedModuleData.module_id).map((s) => s.title);
  }, [allSubtopics, selectedModuleData]);

  const handleCourseChange = (value: string) => {
    setCourseName(value);
    setModuleName("");
    setSubtopic("");
  };

  const handleModuleChange = (value: string) => {
    setModuleName(value);
    setSubtopic("");
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!courseName) nextErrors.courseName = "Course is required.";
    
    // Module and Subtopic only required if NOT an intro video
    if (!isIntro) {
      if (!moduleName) nextErrors.moduleName = "Module is required.";
      if (!subtopic) nextErrors.subtopic = "Subtopic is required.";
    }

    if (!videoTitle) nextErrors.videoTitle = "Video Title is required.";
    if (!videoToEdit && !videoFile) nextErrors.videoFile = "Video file is required.";
    
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const selectedCourseId = selectedCourseData?.course_id;
    const selectedModuleId = isIntro ? null : selectedModuleData?.module_id;
    const selectedSubtopicId = isIntro ? null : allSubtopics.find(s => s.title === subtopic && s.module_id === selectedModuleId)?.subtopic_id;

    const formData = new FormData();
    formData.append("course_id", String(selectedCourseId));
    formData.append("module_id", selectedModuleId ? String(selectedModuleId) : "");
    formData.append("subtopic_id", selectedSubtopicId ? String(selectedSubtopicId) : "");
    formData.append("video_title", videoTitle);
    formData.append("video_subtitle", videoSubtitle);
    formData.append("is_intro_video", String(isIntro ? 1 : 0));
    formData.append("user_id", String(user?.id || 1));

    if (videoToEdit) {
      formData.append("video_mapping_id", String(videoToEdit.mapping_id));
      formData.append("action", "update");
    } else {
      formData.append("action", "insert");
    }

    if (videoFile) formData.append("video", videoFile);

    try {
      const response = await courseService.saveCourseVideo(formData);
      if (response.status === "success" || response.message === "success") {
        showSuccess("Success", `Video ${videoToEdit ? "updated" : "saved"} successfully!`);
        onOperationComplete();
      } else {
        showError("Failed", response.message || "Failed to save video.");
      }
    } catch (err: any) {
      showError("Error", err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingDropdowns) return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E87A2E]"></div>
      <p className="text-[0.82rem] text-[#9597A6]">Loading Data</p>
    </div>
  );

  return (
    <div className="px-5">
      <form onSubmit={handleSubmit} className="bg-white rounded-[16px] border border-[#E5DDD4] p-6 shadow-[0_2px_8px_rgba(43,45,66,.04)]">
        
        {/* Header Section with Toggle */}
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="font-serif text-[1.25rem] text-[#2B2D42] mb-1">
              {videoToEdit ? "Edit Video" : "Add New Video"}
            </h2>
            <p className="text-[13px] text-[#6B6D7B]">
              Define video details and assignments below.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-[#FDF8F4] border border-[#E87A2E]/20 rounded-xl">
            <input 
              type="checkbox" 
              id="isIntro" 
              checked={isIntro} 
              onChange={e => handleIntroToggle(e.target.checked)} 
              className="w-4 h-4 accent-[#E87A2E] cursor-pointer" 
            />
            <label htmlFor="isIntro" className="text-sm font-semibold text-[#2B2D42] cursor-pointer select-none">
              Is this an introduction video?
            </label>
          </div>
        </div>

        {/* Assignments Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <SearchableDropdown 
            label="Course Name" 
            required 
            value={courseName} 
            options={allCourses.map(c => c.course_name)} 
            onChange={handleCourseChange} 
            error={errors.courseName} 
            menuKey="courseName" 
            openDropdownKey={openDropdownKey} 
            setOpenDropdownKey={setOpenDropdownKey} 
            placeholder="Select course" 
          />
          
          <div>
            <SearchableDropdown 
              label="Module Name" 
              required={!isIntro} 
              value={moduleName} 
              options={moduleOptions} 
              onChange={handleModuleChange} 
              error={errors.moduleName} 
              menuKey="moduleName" 
              openDropdownKey={openDropdownKey} 
              setOpenDropdownKey={setOpenDropdownKey} 
              placeholder={isIntro ? "Not required for Intro" : "Select module"} 
              disabled={isIntro}
            />
          </div>

          <div>
            <SearchableDropdown 
              label="Subtopic" 
              required={!isIntro} 
              value={subtopic} 
              options={subtopicOptions} 
              onChange={setSubtopic} 
              error={errors.subtopic} 
              menuKey="subtopic" 
              openDropdownKey={openDropdownKey} 
              setOpenDropdownKey={setOpenDropdownKey} 
              placeholder={isIntro ? "Not required for Intro" : "Select subtopic"} 
              disabled={isIntro}
            />
          </div>
        </div>

        {/* Video Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-[12px] font-semibold text-[#6B6D7B] mb-2">Video Title <span className="text-red-500">*</span></label>
            <input type="text" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} className={`w-full rounded-[12px] border bg-white px-4 py-3 text-[14px] text-[#2B2D42] outline-none ${errors.videoTitle ? "border-red-400" : "border-[#E5DDD4]"}`} />
            {errors.videoTitle && <p className="mt-1 text-[12px] text-red-500">{errors.videoTitle}</p>}
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#6B6D7B] mb-2">Video Subtitle</label>
            <input type="text" value={videoSubtitle} onChange={e => setVideoSubtitle(e.target.value)} className="w-full rounded-[12px] border bg-white px-4 py-3 text-[14px] text-[#2B2D42] outline-none border-[#E5DDD4]" />
          </div>
        </div>

        {/* File Upload Row */}
        <div className="mb-5">
          <label className="block text-[12px] font-semibold text-[#6B6D7B] mb-2">
            Video File {videoToEdit ? <span className="text-gray-400 font-normal">(Leave empty to keep current)</span> : <span className="text-red-500">*</span>}
          </label>
          <input 
            ref={videoInputRef} 
            type="file" 
            accept="video/*" 
            onChange={e => setVideoFile(e.target.files?.[0] ?? null)} 
            className={`w-full rounded-[12px] border bg-white px-4 py-3 text-[14px] text-[#2B2D42] outline-none file:mr-4 file:rounded-md file:border-0 file:bg-[#E87A2E]/10 file:px-3 file:py-2 file:text-[#E87A2E] ${errors.videoFile ? "border-red-400" : "border-[#E5DDD4]"}`} 
          />
          {errors.videoFile && <p className="mt-1 text-[12px] text-red-500">{errors.videoFile}</p>}
          {videoToEdit?.video_path && !videoFile && <p className="mt-2 text-xs text-gray-400 italic">Currently: {videoToEdit.video_path.split('/').pop()}</p>}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-[#F5F5F5]">
          <button type="button" onClick={onOperationComplete} className="px-6 py-2.5 rounded-lg border border-[#E5DDD4] text-[#6B6D7B] hover:text-[#E87A2E] hover:border-[#E87A2E] transition-all">
            Cancel
          </button>
          <button type="submit" className="px-8 py-2.5 rounded-lg bg-[#E87A2E] hover:bg-[#D06A20] text-white font-semibold transition-all flex items-center shadow-md shadow-[#E87A2E]/20" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 animate-spin" size={18} /> Processing...</> : (videoToEdit ? "Update Video" : "Save Video")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVideo;