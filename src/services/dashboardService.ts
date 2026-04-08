import { apiRequest } from "../api/apiClient";
import { API_ENDPOINTS } from "../api/endpoints";
import type {
  EnrollmentRequest,
  EnrollmentResponse,
  ApiResponse,
  DashboardKPI,
  EnrolledCoursesResponse,
  RawDashboardCourse,
  GradesInfoData,
  RecentActivityResponse,
} from "../features/pages/dashboard/dashboard.models";

export const dashboardService = {
  getDashboard: (userId: number) =>
    apiRequest<ApiResponse<RawDashboardCourse[]>>({
      url: `${API_ENDPOINTS.DASHBOARD}?user_id=${userId}`,
      method: "GET",
    }),

  getModules: (courseId: string | number) =>
    apiRequest({
      url: API_ENDPOINTS.MODULES,
      method: "POST",
      data: { course_id: Number(courseId) },
    }),

  getDashboardKPI: (userId: number) =>
    apiRequest<ApiResponse<DashboardKPI>>({
      url: API_ENDPOINTS.DASHBOARD_KPI,
      method: "POST",
      data: { user_id: userId },
    }),

  enrollInCourse: (data: EnrollmentRequest) =>
    apiRequest<EnrollmentResponse>({
      url: API_ENDPOINTS.COURSE_ENROLLMENT,
      method: "POST",
      data,
    }),
  getEnrolledCourses: (userId: number) =>
    apiRequest<EnrolledCoursesResponse>({
      url: `${API_ENDPOINTS.GET_ENROLLED_COURSES}?user_id=${userId}`,
      method: "GET",
    }),

  getGradesInfoByUser: (userId: number) =>
    apiRequest<ApiResponse<GradesInfoData>>({
      url: `${API_ENDPOINTS.GRADES_INFO_BY_USER}?user_id=${userId}`,
      method: "GET",
    }),

  getCompletedCourses: (userId: number) =>
    apiRequest<EnrolledCoursesResponse>({
      url: `${API_ENDPOINTS.GET_COMPLETED_COURSES}?user_id=${userId}`,
      method: "GET",
    }),

  getUserRecentActivity: (userId: number) =>
    apiRequest<RecentActivityResponse>({
      url: `${API_ENDPOINTS.GET_USER_RECENT_ACTIVITY}?user_id=${userId}`,
      method: "GET",
    }),
};
