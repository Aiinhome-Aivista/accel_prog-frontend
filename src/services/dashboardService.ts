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
  Flashcard,
} from "../features/pages/dashboard/dashboard.models";
import type {
  CourseLearningContent,
  CourseHomeOverview,
  CourseHomeTimelineItem,
  CourseVideoData,
} from "../features/pages/course-learning/course-learning.models";

export const dashboardService = {
  getDashboard: (userId: number) =>
    apiRequest<ApiResponse<RawDashboardCourse[]>>({
      url: `${API_ENDPOINTS.DASHBOARD}?user_id=${userId}`,
      method: "GET",
    }),

  getModules: (courseId: string | number, userId: number) =>
    apiRequest({
      url: API_ENDPOINTS.MODULES,
      method: "POST",
      data: { course_id: Number(courseId), user_id: userId },
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

  getFlashcards: () =>
    apiRequest<ApiResponse<Flashcard[]>>({
      url: API_ENDPOINTS.GET_FLASHCARDS,
      method: "GET",
    }),
  getCourseLearningContent: (courseId: number, userId: number) =>
    apiRequest<ApiResponse<CourseLearningContent>>({
      url: API_ENDPOINTS.GET_COURSE_LEARNING_CONTENT,
      method: "POST",
      data: { course_id: courseId, user_id: userId },
    }),

  completeSubtopicModuleCourseWiseByUser: (courseId: number, moduleId: number, subtopicId: number, userId: number) =>
    apiRequest({
      url: API_ENDPOINTS.COMPLETE_SUBTOPIC_MODULE_COURSE_WISE_BY_USER,  
      method: "POST",
      data: { course_id: courseId, module_id: moduleId, subtopic_id: subtopicId, user_id: userId },
    }),

  submitQuestionAnswer: (
    userId: number,
    courseId: number,
    moduleId: number,
    subtopicId: number,
    questionId: number,
    userAnswer: string | number,
    timeTaken: number = 0
  ) =>
    apiRequest({
      url: API_ENDPOINTS.SUBMIT_USER_ANSWER,
      method: "POST",
      data: {
        user_id: userId,
        course_id: courseId,
        module_id: moduleId,
        subtopic_id: subtopicId,
        question_id: questionId,
        user_answer: userAnswer,
        time_taken: timeTaken,
      },
    }),

  getCourseHomeOverview: (courseId: number) =>
    apiRequest<ApiResponse<CourseHomeOverview>>({
      url: API_ENDPOINTS.COURSE_HOME_OVERVIEW,
      method: "POST",
      data: { course_id: courseId },
    }),

  getCourseHomeTimeline: (courseId: number, userId: number) =>
    apiRequest<ApiResponse<CourseHomeTimelineItem[]>>({
      url: API_ENDPOINTS.COURSE_HOME_TIMELINE,
      method: "POST",
      data: { course_id: courseId, user_id: userId },
    }),
    
  getCourseVideos: (courseId: number) =>
    apiRequest<any>({
      url: `${API_ENDPOINTS.GET_COURSE_VIDEOS}?course_id=${courseId}`,
      method: "GET",
    }),

  submitCohortAnswer: (
    userId: number,
    courseId: number,
    moduleId: number,
    subtopicId: number,
    cohortQuestionId: number,
    answer: string
  ) =>
    apiRequest({
      url: API_ENDPOINTS.SUBMIT_COHORT_ANSWER,
      method: "POST",
      data: {
        user_id: userId,
        course_id: courseId,
        module_id: moduleId,
        subtopic_id: subtopicId,
        cohort_question_id: cohortQuestionId,
        answer: answer,
      },
    }),

  getUserWeeklyStreak: (userId: number) =>
    apiRequest<ApiResponse<{ streak_days: number; weekly: any[] }>>({
      url: API_ENDPOINTS.GET_USER_WEEKLY_STREAK,
      method: "POST",
      data: { user_id: userId },
    }),
};
