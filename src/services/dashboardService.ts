import { apiRequest } from "../api/apiClient";
import { API_ENDPOINTS } from "../api/endpoints";

export const dashboardService = {
  getDashboard: () =>
    apiRequest({
      url: API_ENDPOINTS.DASHBOARD,
      method: "GET",
    }),

  getModules: (courseId: string | number) =>
    apiRequest({
      url: API_ENDPOINTS.MODULES,
      method: "POST",
      data: { course_id: Number(courseId) },
    }),

  getDashboardKPI: (userId: number) =>
    apiRequest({
      url: API_ENDPOINTS.DASHBOARD_KPI,
      method: "POST",
      data: { user_id: userId },
    }),
};
