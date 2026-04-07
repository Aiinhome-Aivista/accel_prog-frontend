import { apiRequest } from "../api/apiClient";
import { API_ENDPOINTS } from "../api/endpoints";

export const dashboardService = {
  getDashboard: () =>
    apiRequest({
      url: API_ENDPOINTS.DASHBOARD,
      method: "GET",
    }),

};