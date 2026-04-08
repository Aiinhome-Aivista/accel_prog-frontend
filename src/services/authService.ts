import { apiRequest } from "../api/apiClient";
import { API_ENDPOINTS } from "../api/endpoints";


export const authService = {
  registration:(data: any) =>
    apiRequest({
      url: API_ENDPOINTS.REGISTRATION,
      method: "POST",
      data,
    }),
  sendOtp:(data: { email: string }) =>
    apiRequest({
      url: API_ENDPOINTS.SEND_OTP,
      method: "POST",
      data,
    }),
  verifyOtp:(data: { email: string; otp_code: string }) =>
    apiRequest({
      url: API_ENDPOINTS.VERIFY_OTP,
      method: "POST",
      data,
    }),
  googleSignIn:(data: { email: string; full_name: string; is_google_verified: boolean }) =>
    apiRequest({
      url: API_ENDPOINTS.GOOGLE_SIGNIN,
      method: "POST",
      data,
    }),
  adminSendOtp:(data: { email: string }) =>
    apiRequest({
      url: API_ENDPOINTS.admin_generate_otp,
      method: "POST",
      data,
    }),
  adminVerifyOtp:(data: { email: string; otp_code: string }) =>
    apiRequest({
      url: API_ENDPOINTS.admin_verify_otp,
      method: "POST",
      data,
    }),
};