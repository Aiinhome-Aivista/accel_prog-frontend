import { apiRequest } from "../api/apiClient";
import { API_ENDPOINTS } from "../api/endpoints";

export const courseService = {
  // Define SaveContentPayload here or import from a shared types file
  // Assuming it's defined locally for now based on previous context
  // This type should match what CreateContent sends
  saveContent: (data: {
    content: string;
    course_id: number | undefined;
    module_id: number | undefined;
    subtopic_id: number | undefined;
    subtopic_type: string;
    mediaFileName: string | null;
    created_by?: number;
  }) =>
    apiRequest({
      url: API_ENDPOINTS.save_content,
      method: "POST",
      data,
    }),
  updateContent: (data: {
    content_id: number;
    content: string;
    course_id: number | undefined;
    module_id: number | undefined;
    subtopic_id: number | undefined;
    subtopic_type: string;
    mediaFileName: string | null;
    created_by?: number;
  }) =>
    apiRequest({
      url: API_ENDPOINTS.update_content,
      method: "PUT", // Assuming PUT for updates
      data,
    }),

  getCourse: () =>
    apiRequest({
      url: API_ENDPOINTS.COURSE,
      method: "GET",
    }),

  getContentDropdownData: () =>
    apiRequest({
      url: API_ENDPOINTS.content_dropdown,
      method: "GET",
    }),

  getAllContent: () =>
    apiRequest({
      url: API_ENDPOINTS.get_all_contents,
      method: "GET",
    }),
};