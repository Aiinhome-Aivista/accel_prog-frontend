import { useState, type FormEvent } from 'react';
import './Login.css';

/* ─── MokshPath Logo SVG Component ─── */
const MokshPathLogo = ({ size = 42, className = '' }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 42 42" fill="none">
    <circle cx="21" cy="14" r="6" fill="#E87A2E" />
    <path
      d="M21 20c-6 0-10 3-10 7 0 2 1 3 2 4l2-3c1-1.5 2.5-2 3-2h6c.5 0 2 .5 3 2l2 3c1-1 2-2 2-4 0-4-4-7-10-7z"
      fill="#E87A2E"
    />
    <path
      d="M11 31c0 0 2 4 10 4s10-4 10-4"
      stroke="#E87A2E"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <ellipse cx="21" cy="38" rx="8" ry="2" fill="#E87A2E" opacity=".15" />
    <path
      d="M8 27l-3 2m29-2l3 2"
      stroke="#E87A2E"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="21" cy="14" r="3" fill="#FFF" opacity=".3" />
  </svg>
);

/* ─── Google Logo SVG ─── */
const GoogleLogo = () => (
  <svg width="16" height="16" viewBox="0 0 18 18">
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
);

/* ─── Login Component ─── */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // TODO: integrate with actual auth API
    console.log('Login submitted:', { email, password, rememberMe });
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  const handleGoogleSignIn = () => {
    // TODO: integrate Google OAuth
    console.log('Google Sign-in clicked');
  };

  return (
    <div className="login-page" id="login-page">
      {/* ─── Left Visual Panel ─── */}
      <div className="login-visual">
        <div className="login-visual-content">
          <div className="login-visual-logo">
            <MokshPathLogo size={48} />
            <div className="login-visual-logo-text">
              <span className="login-visual-logo-name">
                Moksh<span>Path</span>
              </span>
              <span className="login-visual-logo-tag">Guided Path to True Learning</span>
            </div>
          </div>

          <h1>
            The <em>AI-Native</em> Summer Series
          </h1>
          <p className="login-visual-sub">
            Four accelerated courses that take you from AI consumer to AI builder —
            from prompt engineering to autonomous agents.
          </p>

          <div className="login-stats">
            <div className="login-stat">
              <div className="login-stat-num">4</div>
              <div className="login-stat-label">Courses</div>
            </div>
            <div className="login-stat">
              <div className="login-stat-num">12</div>
              <div className="login-stat-label">Modules</div>
            </div>
            <div className="login-stat">
              <div className="login-stat-num">4</div>
              <div className="login-stat-label">Capstones</div>
            </div>
            <div className="login-stat">
              <div className="login-stat-num">20+</div>
              <div className="login-stat-label">Yrs Expertise</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right Form Panel ─── */}
      <div className="login-form-panel">
        <div className="login-card">
          {/* Brand */}
          <div className="login-card-brand">
            <MokshPathLogo size={34} />
            <span>
              Moksh<em>Path</em>
            </span>
          </div>

          <h2>Welcome Back</h2>
          <p className="login-card-sub">
            Sign in to access your courses and track your progress.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className={`login-form-group${errors.email ? ' error' : ''}`}>
              <label htmlFor="login-email">Email Address</label>
              <div className="login-input-wrap">
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  autoComplete="email"
                />
                <svg viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 4l6 4 6-4"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="1.5"
                    y="3"
                    width="13"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                </svg>
              </div>
              {errors.email && (
                <div className="login-error-msg">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M6 3.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="6" cy="8.5" r="0.6" fill="currentColor" />
                  </svg>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div className={`login-form-group${errors.password ? ' error' : ''}`}>
              <label htmlFor="login-password">Password</label>
              <div className="login-input-wrap">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  autoComplete="current-password"
                />
                <svg viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.3" />
                  <path
                    d="M5 7V5a3 3 0 016 0v2"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                  <circle cx="8" cy="10.5" r="1" fill="currentColor" />
                </svg>
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2 2l12 12M6.5 6.5a2 2 0 002.8 2.8"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M4.2 4.2C2.7 5.3 1.5 7 1.5 8c0 2 3 5 6.5 5 1.2 0 2.3-.3 3.3-.8M10.5 7a2 2 0 00-2-2"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M14.5 8c0-2-3-5-6.5-5-.5 0-1 .05-1.5.15"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M1.5 8c0 2 3 5 6.5 5s6.5-3 6.5-5-3-5-6.5-5S1.5 6 1.5 8z"
                        stroke="currentColor"
                        strokeWidth="1.3"
                      />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="login-error-msg">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M6 3.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="6" cy="8.5" r="0.6" fill="currentColor" />
                  </svg>
                  {errors.password}
                </div>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="login-form-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="login-forgot">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-submit"
              disabled={isSubmitting}
              id="login-submit-btn"
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider">or</div>

          {/* Google */}
          <button
            type="button"
            className="login-btn-google"
            onClick={handleGoogleSignIn}
            id="login-google-btn"
          >
            <GoogleLogo />
            Continue with Google
          </button>

          {/* Sign Up */}
          <div className="login-signup-link">
            Don't have an account?{' '}
            <a href="#">
              Enroll Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
