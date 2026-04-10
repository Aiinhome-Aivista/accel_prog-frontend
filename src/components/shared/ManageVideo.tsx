import React, { useEffect, useState, useMemo } from "react";
import { courseService } from "../../services/courseService";
import { useToast } from "../../utils/ToastContext";
import { Edit, Trash2, Search, Video } from "lucide-react";

interface VideoItem {
  video_mapping_id: number;
  course_id: number;
  module_id: number;
  subtopic_id: number;
  video_title: string;
  video_subtitle: string;
  video_path: string;
  thumbnail_path: string;
  duration_sec: number;
  is_intro_video: boolean;
  created_at: string;
  course_name: string;
  module_name: string;
  subtopic_title: string;
}

interface ManageVideoProps {
  setActiveTab: (tab: "home" | "create-video" | "manage-video") => void;
  onEdit: (videoItem: VideoItem) => void;
}

const ManageVideo: React.FC<ManageVideoProps> = ({ setActiveTab, onEdit }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { showError } = useToast();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await (courseService as any).getAllVideos(); // Assumes this service method exists
        if (response.status === "success" && Array.isArray(response.data)) {
          setVideos(response.data);
        } else {
          showError("Error", response.message || "Failed to fetch videos.");
        }
      } catch (err: any) {
        showError("Fetch Error", err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [showError]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const filteredVideos = useMemo(() => {
    if (!searchTerm) return videos;
    return videos.filter(
      (item) =>
        item.video_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.module_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [videos, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E87A2E]"></div>
        <p className="ml-3 text-gray-600">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className=" rounded-lg">
      <div className="px-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-3">
          <h2 className="font-serif text-[1.25rem] text-[#2B2D42]">Manage Videos</h2>
          <button
            onClick={() => setActiveTab("create-video")}
            className="px-5 py-2.5 rounded-lg bg-[#E87A2E] hover:bg-[#D06A20] text-white font-semibold transition-colors flex items-center gap-2"
          >
            <Video size={18} /> Add New Video
          </button>
        </div>

        <div className="relative w-full sm:w-72 mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#E87A2E] focus:border-[#E87A2E]"
          />
        </div>
      </div>

      <div className="overflow-x-auto px-5 rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[#6B6D7B] uppercase bg-[#F9F5F0]">
            <tr>
              <th className="px-6 py-3">Sl. No.</th>
              <th className="px-6 py-3">Video Title</th>
              <th className="px-6 py-3">Course / Module / Subtopic</th>
              <th className="px-6 py-3 text-center">Duration</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVideos.map((item, index) => (
              <tr key={item.video_mapping_id} className="bg-white border-b border-[#E5DDD4] hover:bg-[#F9F5F0] transition-colors">
                <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                <td className="px-6 py-4 font-bold text-[#2B2D42]">{item.video_title}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{item.course_name}</div>
                  <div className="text-xs text-gray-500">{item.module_name} / {item.subtopic_title}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-gray-800 font-medium">{formatDuration(item.duration_sec)}</div>
                </td>
                <td className="px-6 py-4">{formatDate(item.created_at)}</td>
                <td className="px-6 py-4 flex items-center gap-4">
                  <button 
                    onClick={() => onEdit(item)} 
                    className="p-2 text-[#E87A2E] hover:bg-orange-50 rounded-full transition-colors" 
                    title="Edit Video"
                  >
                    <Edit size={18} />
                  </button>
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Delete Video">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredVideos.length === 0 && (
          <div className="text-center py-10 text-gray-500 italic">No videos found.</div>
        )}
      </div>
    </div>
  );
};

export default ManageVideo;