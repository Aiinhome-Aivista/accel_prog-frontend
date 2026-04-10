import { apiRequest } from "../api/apiClient";
import { API_ENDPOINTS } from "../api/endpoints";

export interface QuestionPayload {
  action: "insert" | "update" | "delete"; // The required action parameter
  question_id: number | null;            // null for insert, number for update/delete
  course_id: number;
  module_id: number;
  subtopic_id: number;                   // Usually required for assessments
  category_id: number;
  type_id: number;                       // 1 for MCQ, 2 for Subjective
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string[] | string;     // Match your DB format
}

// --- Content Management Types ---
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
      url: API_ENDPOINTS.save_content,
      method: "POST", // Assuming PUT for updates
      data,
    }),

  // --- Question Management Types ---
  manageQuestions: (data: { questions: QuestionPayload[] }) =>
    apiRequest({
      url: API_ENDPOINTS.manage_questions,
      method: "POST",
      data, // This sends { "questions": [...] }
    }),

  // --- General Course/Content/Question Fetching ---
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

  getAllQuestions: () =>
    apiRequest({
      url: API_ENDPOINTS.get_all_questions,
      method: "GET",
    }),

  getAllVideos: () =>   
  apiRequest({
    url: API_ENDPOINTS.get_course_video_mapping,
    method: "GET",
  }),
};