import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../Firebase";
import { authService } from "../../services/authService";
import LogoIcon from '../../assets/logogod.svg'
import { useToast } from "../../context/ToastContext";


interface SignInModalProps {
    open: boolean
    onClose: () => void
    onSignIn: (isNewUser: boolean, email: string) => void
}

function SignInModal({ open, onClose, onSignIn }: SignInModalProps) {
    const [email, setEmail] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    

    const { showError } = useToast();
    if (!open) return null


    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("Success:", result.user);
            // Default to true (registration) for Google unless backend confirms
            onSignIn(true, result.user.email || ""); 
        } catch (error: any) {
            if (error.code === 'auth/configuration-not-found') {
                console.error("Firebase Configuration Error: Auth not enabled or project/domain mismatch.");
                showError("Sign-in error", "Sign-in configuration not found. Please verify Firebase project settings.");
            } else if (error.code === 'auth/popup-closed-by-user') {
                console.warn("User closed the Google sign-in popup.");
            } else {
                console.error("Error signing in with Google:", error);
                showError("Sign-in error", `Error signing in: ${error.message}`);
            }
        }
    };

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
                alert("OTP sent successfully to your email!");
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
            const response = await authService.verifyOtp({ email, otp_code: otpCode });
            console.log("Verify OTP Success:", response);
            if (response.status === "success") {
                // Pass the is_new_user flag and the email address back to the parent
                onSignIn(response.is_new_user === true, email); 
            } else {
                alert(response.message || "Invalid OTP code.");
            }
        } catch (error: any) {
            console.error("Verify OTP Error:", error);
            alert(error.message || "Verification failed. Please try again.");
        } finally {
            setIsVerifying(true); // Should probably be false
            setIsVerifying(false);
        }
    };



    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="modal" onClick={(event) => event.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close sign in modal">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

                <h2>Sign In</h2>
                <div className="modal-sub">Access your courses and track your progress.</div>

                <div className="form-group email-group">
                    <label htmlFor="signin-email">Email</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
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
                            onClick={handleSendOtp}
                            disabled={isSending || isOtpSent}
                            style={{ 
                                padding: '0 15px', 
                                border: '1px solid #E87A2E', 
                                color: '#E87A2E', 
                                borderRadius: '6px', 
                                fontSize: '13px',
                                fontWeight: 500,
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {isSending ? "Sending..." : isOtpSent ? "Sent" : "Send OTP"}
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
                    className="form-submit" 
                    onClick={handleVerifyOtp}
                    disabled={isVerifying || !isOtpSent}
                >
                    {isVerifying ? "Verifying..." : "Sign In"}
                </button>


                <div className="form-divider">or</div>

                <button className="btn-google" onClick={handleGoogleSignIn}>
                    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                        <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>
            </div>
        </div>
    )
}

export default SignInModal
