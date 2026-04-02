import { apiRequest } from "../api/apiClient";
import { API_ENDPOINTS } from "../api/endpoints";


export const authService = {
  registration:(data: { email: string; password: string }) =>
    apiRequest({
      url: API_ENDPOINTS.REGISTRATION,
      method: "POST",
      data,
    }),
};