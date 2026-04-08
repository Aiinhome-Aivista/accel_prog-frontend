import { apiRequest } from "../api/apiClient";
import { API_ENDPOINTS } from "../api/endpoints";

export const courseService = {
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

  saveContent: (data: any) =>
    apiRequest({
      url: API_ENDPOINTS.save_content,
      method: "POST",
      data,
    }),
};