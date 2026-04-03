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
};