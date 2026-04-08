import { useState, useEffect } from "react";
import { auth } from "../Firebase";
import { authService } from "../services/authService";
import LogoIcon from "../assets/logogod.svg";
import { useToast } from "../utils/ToastContext";
import { useNavigate } from "react-router-dom";

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  onSignIn: (
    isNewUser: boolean,
    email: string,
    name?: string,
    isAdmin?: boolean,
  ) => void;
}

function AdminSignInModal({ open, onClose, onSignIn }: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setEmail("");
      setOtpCode("");
      setIsOtpSent(false);
      setIsSending(false);
      setIsVerifying(false);
    }
  }, [open]);

  const { showError } = useToast();
  if (!open) return null;

  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter your email address first.");
      return;
    }

    setIsSending(true);
    try {
      const response = await authService.sendOtp({ email });
      console.log("Send OTP Success:", response);
      if (response.status === "success") {
        setIsOtpSent(true);
      } else {
        alert(response.message || "Failed to send OTP.");
      }
    } catch (error: any) {
      console.error("Send OTP Error:", error);
      alert(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!email || !otpCode) {
      alert("Please provide both email and OTP code.");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await authService.verifyOtp({
        email,
        otp_code: otpCode,
      });
      console.log("Verify OTP Success:", response);
      if (response.status === "success") {
        const isExistingUser =
          response.is_new_user === false ||
          response.data?.is_new_user === false;
        const name = response.data?.full_name || "User";
        onSignIn(!isExistingUser, email, name, true);
      } else {
        alert(response.message || "Invalid OTP code.");
      }
    } catch (error: any) {
      console.error("Verify OTP Error:", error);
      alert(error.message || "Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close sign in modal"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 4l10 10M14 4L4 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="modal-brand">
          <img
            src={LogoIcon}
            className="nav-logo-icon"
            alt="Logo"
            aria-hidden="true"
          />
          <span className="text-2xl">
            Moksh<em>Path</em>
          </span>
        </div>

        <h2>Admin Sign In</h2>
        <div className="modal-sub">
          Access your courses and track your progress.
        </div>

        <div className="form-group email-group">
          <label htmlFor="signin-email">Email</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              id="signin-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ flex: 1 }}
              disabled={isOtpSent}
            />
            <button
              type="button"
              className="btn-otp"
              onClick={() => {
                if (isOtpSent) {
                  setIsOtpSent(false);
                  setOtpCode("");
                } else {
                  handleSendOtp();
                }
              }}
              disabled={isSending}
              style={{
                padding: "0 15px",
                border: "1px solid #E87A2E",
                color: "#E87A2E",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              {isSending ? "Sending..." : isOtpSent ? "Edit Email" : "Send OTP"}
            </button>
          </div>
        </div>

        {isOtpSent && (
          <div className="form-group">
            <label htmlFor="signin-otp">OTP Code</label>
            <input
              id="signin-otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
            />
          </div>
        )}
        <button
          className="btn-signin btn-signin-fill"
          onClick={() => navigate("/admin/admin-dashboard")}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default AdminSignInModal;
