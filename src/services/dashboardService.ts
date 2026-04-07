import { apiRequest } from "../api/apiClient";
import { API_ENDPOINTS } from "../api/endpoints";

export const dashboardService = {
  getDashboard: () =>
    apiRequest({
      url: API_ENDPOINTS.DASHBOARD,
      method: "GET",
    }),
  getDashboardKPI: (userId: number) =>
    apiRequest({
      url: API_ENDPOINTS.DASHBOARD_KPI,
      method: "POST",
      data: { user_id: userId },
    }),
};