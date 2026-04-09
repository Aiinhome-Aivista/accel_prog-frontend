import { Save } from "lucide-react";

export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  USERS: "/users",
  COURSE: "/api/v1/courses",
  REGISTRATION: "/api/v1/register",
  SEND_OTP: "/api/v1/send-otp",
  VERIFY_OTP: "/api/v1/verify-otp",
  GOOGLE_SIGNIN: "/api/v1/google-signin",
  admin_generate_otp: "/api/v1/admin_generate_otp",
  admin_verify_otp: "/api/v1/admin_verify_otp",
  content_dropdown: "/api/v1/get_master_dropdown_data",
  save_content: "/api/v1/save_content", // New endpoint for updating content
  get_all_contents: "/api/v1/admin/get_all_contents",
  get_all_questions: "/api/v1/get-assessment-questions",
  manage_questions: "/api/v1/manage-assessment-questions", // Single endpoint for all question operations
};