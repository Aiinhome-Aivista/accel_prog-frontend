import { apiRequest } from "../api/apiClient";
import { API_ENDPOINTS } from "../api/endpoints";

export const userService = {
  login: (data: { email: string; password: string }) =>
    apiRequest({
      url: API_ENDPOINTS.LOGIN,
      method: "POST",
      data,
    }),

  getUsers: () =>
    apiRequest({
      url: API_ENDPOINTS.USERS,
      method: "GET",
    }),

  updateUser: (id: string, data: any) =>
    apiRequest({
      url: `${API_ENDPOINTS.USERS}/${id}`,
      method: "PUT",
      data,
    }),
};