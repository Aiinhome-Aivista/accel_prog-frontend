import React, { useMemo, useRef, useState, useEffect } from "react";
import { useToast } from "../../utils/ToastContext";
import { courseService } from "../../services/courseService";
import SearchableDropdown from "./SearchableDropdown";
import { Loader2 } from "lucide-react";

// Based on the user's SQL query
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
  course_name?: string; // For pre-filling form
  module_name?: string | null; // For pre-filling form
  title?: string | null; // For pre-filling form (subtopic title)
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
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [duration, setDuration] = useState<number | string>("");
  const [isIntro, setIsIntro] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoadingDropdowns(true);
      try {
        const response = await courseService.getContentDropdownData(); // Re-use existing dropdown data endpoint
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

  const resetForm = () => {
    setCourseName("");
    setModuleName("");
    setSubtopic("");
    setVideoTitle("");
    setVideoSubtitle("");
    setVideoFile(null);
    setThumbnailPath("");
    setDuration("");
    setIsIntro(false);
    setErrors({});
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  useEffect(() => {
    if (videoToEdit) {
      setCourseName(videoToEdit.course_name || "");
      setModuleName(videoToEdit.module_name || "");
      setSubtopic(videoToEdit.title || "");
      setVideoTitle(videoToEdit.video_title);
      setVideoSubtitle(videoToEdit.video_subtitle);
      setDuration(videoToEdit.duration_sec);
      setIsIntro(videoToEdit.is_intro_video);
      setVideoFile(null);
      setThumbnailPath(videoToEdit.thumbnail_path || "");
    } else {
      resetForm();
    }
  }, [videoToEdit]);

  const selectedCourseData = useMemo(() => allCourses.find((c) => c.course_name === courseName), [allCourses, courseName]);
  const moduleOptions = useMemo(() => {
    if (!selectedCourseData) return allModules.map((m) => m.module_name);
    return allModules.filter((m) => m.course_id === selectedCourseData.course_id).map((m) => m.module_name);
  }, [allModules, selectedCourseData]);
  const selectedModuleData = useMemo(() => allModules.find((m) => m.module_name === moduleName && m.course_id === selectedCourseData?.course_id), [allModules, moduleName, selectedCourseData]);
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

  const handleCancel = () => {
    onOperationComplete();
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!courseName) nextErrors.courseName = "Course is required.";
    if (!moduleName) nextErrors.moduleName = "Module is required.";
    if (!subtopic) nextErrors.subtopic = "Subtopic is required.";
    if (!videoTitle) nextErrors.videoTitle = "Video Title is required.";
    if (!videoToEdit && !videoFile) nextErrors.videoFile = "Video file is required.";
    if (!thumbnailPath) nextErrors.thumbnailPath = "Thumbnail path is required.";
    if (duration === "" || Number(duration) <= 0) nextErrors.duration = "Duration must be a positive number.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const formData = new FormData();
    const selectedCourseId = selectedCourseData?.course_id;
    const selectedModuleId = selectedModuleData?.module_id;
    const selectedSubtopicId = allSubtopics.find(s => s.title === subtopic && s.module_id === selectedModuleId)?.subtopic_id;

    if (!selectedCourseId || !selectedModuleId || !selectedSubtopicId) {
      showError("Validation Error", "Please select a valid Course, Module, and Subtopic.");
      setIsSubmitting(false);
      return;
    }

    // Add action for the backend to distinguish between create and update
    if (videoToEdit) {
      formData.append("action", "update");
      formData.append("video_mapping_id", String(videoToEdit.mapping_id));
    } else {
      formData.append("action", "insert");
    }

    formData.append("course_id", String(selectedCourseId));
    formData.append("module_id", String(selectedModuleId));
    formData.append("subtopic_id", String(selectedSubtopicId));
    formData.append("video_title", videoTitle);
    formData.append("video_subtitle", videoSubtitle);
    formData.append("duration_sec", String(duration));
    formData.append("is_intro_video", String(isIntro));
    formData.append("thumbnail_path", thumbnailPath);

    if (videoFile) formData.append("video", videoFile);

    try {
      let response;
      response = await (courseService as any).manageVideos(formData);
      if (response.status === "success") {
        showSuccess("Video Saved", `Video ${videoToEdit ? "updated" : "created"} successfully!`);
        onOperationComplete();
      } else {
        showError("Submission Failed", response.message || `Failed to ${videoToEdit ? "update" : "save"} video.`);
      }
    } catch (err: any) {
      showError("Submission Error", err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingDropdowns) return <div className="flex flex-col justify-center items-center min-h-[80vh] gap-3">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E87A2E]"></div>
    <p className="text-[0.82rem] text-[#9597A6]">Loading Data</p>
  </div>;

  return (
    <div className="px-5">
    <form onSubmit={handleSubmit} className="bg-white rounded-[16px] border border-[#E5DDD4] p-6 shadow-[0_2px_8px_rgba(43,45,66,.04)]">
      <div className="mb-6">
        <h2 className="font-serif text-[1.25rem] text-[#2B2D42] mb-2">
          {videoToEdit ? "Edit Video" : "Add New Video"}
        </h2>
        <p className="text-[13px] text-[#6B6D7B]">
          Fill all required fields and upload video and thumbnail files.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <SearchableDropdown label="Course Name" required value={courseName} options={allCourses.map(c => c.course_name)} onChange={handleCourseChange} error={errors.courseName} menuKey="courseName" openDropdownKey={openDropdownKey} setOpenDropdownKey={setOpenDropdownKey} placeholder="Select course" />
        <SearchableDropdown label="Module Name" required value={moduleName} options={moduleOptions} onChange={handleModuleChange} error={errors.moduleName} menuKey="moduleName" openDropdownKey={openDropdownKey} setOpenDropdownKey={setOpenDropdownKey} placeholder="Select module" />
        <SearchableDropdown label="Subtopic" required value={subtopic} options={subtopicOptions} onChange={setSubtopic} error={errors.subtopic} menuKey="subtopic" openDropdownKey={openDropdownKey} setOpenDropdownKey={setOpenDropdownKey} placeholder="Select subtopic" />
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-[12px] font-semibold text-[#6B6D7B] mb-2">Video File {videoToEdit ? <span className="text-gray-400">(Optional)</span> : <span className="text-red-500">*</span>}</label>
          <input ref={videoInputRef} type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] ?? null)} className={`w-full rounded-[12px] border bg-white px-4 py-3 text-[14px] text-[#2B2D42] outline-none file:mr-4 file:rounded-md file:border-0 file:bg-[#E87A2E]/10 file:px-3 file:py-2 file:text-[#E87A2E] ${errors.videoFile ? "border-red-400" : "border-[#E5DDD4]"}`} />
          {errors.videoFile && <p className="mt-1 text-[12px] text-red-500">{errors.videoFile}</p>}
          {videoToEdit?.video_path && !videoFile && <p className="mt-2 text-xs text-gray-500">Current file: {videoToEdit.video_path}</p>}
        </div>
        {/* <div>
          <label className="block text-[12px] font-semibold text-[#6B6D7B] mb-2">Thumbnail Path <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={thumbnailPath}
            onChange={(e) => setThumbnailPath(e.target.value)}
            placeholder="https://example.com/thumbnail.jpg"
            className={`w-full rounded-[12px] border bg-white px-4 py-3 text-[14px] text-[#2B2D42] outline-none ${
              errors.thumbnailPath ? "border-red-400" : "border-[#E5DDD4]"
            }`}
          />
          {errors.thumbnailPath && <p className="mt-1 text-[12px] text-red-500">{errors.thumbnailPath}</p>}
          {thumbnailPath && <img src={thumbnailPath} alt="Thumbnail Preview" className="mt-2 rounded-lg w-48 h-auto object-cover bg-gray-100" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} onLoad={(e) => ((e.target as HTMLImageElement).style.display = 'block')} />}
        </div> */}
                <div className="flex items-center pt-6">
          <input type="checkbox" id="isIntro" checked={isIntro} onChange={e => setIsIntro(e.target.checked)} className="w-4 h-4 accent-[#E87A2E]" />
          <label htmlFor="isIntro" className="ml-2 text-sm font-medium text-[#2B2D42]">Is this an introduction video?</label>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-[12px] font-semibold text-[#6B6D7B] mb-2">Duration (seconds) <span className="text-red-500">*</span></label>
          <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className={`w-full rounded-[12px] border bg-white px-4 py-3 text-[14px] text-[#2B2D42] outline-none ${errors.duration ? "border-red-400" : "border-[#E5DDD4]"}`} />
          {errors.duration && <p className="mt-1 text-[12px] text-red-500">{errors.duration}</p>}
        </div>
        <div className="flex items-center pt-6">
          <input type="checkbox" id="isIntro" checked={isIntro} onChange={e => setIsIntro(e.target.checked)} className="w-4 h-4 accent-[#E87A2E]" />
          <label htmlFor="isIntro" className="ml-2 text-sm font-medium text-[#2B2D42]">Is this an introduction video?</label>
        </div>
      </div> */}

      <div className="flex justify-between items-center mt-6">
        <button type="button" onClick={handleCancel} className="px-5 py-2.5 rounded-lg border border-[#E5DDD4] text-[#6B6D7B] hover:text-[#E87A2E] hover:border-[#E87A2E] transition-colors">Cancel</button>
        <button type="submit" className="px-5 py-2.5 rounded-lg bg-[#E87A2E] hover:bg-[#D06A20] text-white font-semibold transition-colors flex items-center" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 animate-spin" size={18} />}
          {isSubmitting ? (videoToEdit ? "Updating..." : "Submitting...") : (videoToEdit ? "Update Video" : "Submit Video")}
        </button>
      </div>
      </form>
      </div>
  );
};

export default CreateVideo;