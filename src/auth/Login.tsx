import { useState, useEffect, useRef, type FormEvent } from 'react'
import siteData from '../data/siteData.json'

const { login: loginData } = siteData

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
)

/* ─── MokshPath Logo SVG ─── */
const BrandLogo = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" fill="none" className="text-orange-500">
    <circle cx="16" cy="7" r="3" fill="currentColor" />
    <path
      d="M16 11 C16 11 12 14 10 17 C9 18.5 10 20 11.5 20 L14 20 L14 24 C14 24.5 14.5 25 15 25 L17 25 C17.5 25 18 24.5 18 24 L18 20 L20.5 20 C22 20 23 18.5 22 17 C20 14 16 11 16 11Z"
      fill="currentColor"
    />
    <path d="M10 18 C8 17 6.5 17.5 6 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M22 18 C24 17 25.5 17.5 26 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

/* ─── Props type ─── */
interface LoginDialogProps {
  isOpen: boolean
  onClose: () => void
  onRegister?: () => void
}

/* ─── Login Dialog Component ─── */
export default function LoginDialog({ isOpen, onClose, onRegister }: LoginDialogProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  /* Close on Escape key */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  /* Close on overlay click */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  /* Validation */
  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address'
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /* Submit */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    // TODO: integrate with actual auth API
    console.log('Login submitted:', { email, password, rememberMe })
    setTimeout(() => {
      setIsSubmitting(false)
      onClose()
      if (onRegister) onRegister()
    }, 1500)
  }

  /* Google Sign-in */
  const handleGoogleSignIn = () => {
    // TODO: integrate Google OAuth
    console.log('Google Sign-in clicked')
  }

  /* Reset form on close */
  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setPassword('')
      setShowPassword(false)
      setErrors({})
      setIsSubmitting(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      id="login-overlay"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className="relative w-[92%] max-w-[420px] bg-white rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        style={{ fontFamily: "'Montserrat', 'Plus Jakarta Sans', sans-serif" }}
      >
        {/* ── Close Button ── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors duration-200"
          aria-label="Close login dialog"
          id="login-close-btn"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* ── Brand ── */}
        <div className="flex items-center gap-2.5 mb-6">
          <BrandLogo />
          <span className="text-lg font-bold text-orange-500 tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {loginData.brand}
          </span>
        </div>

        {/* ── Heading ── */}
        <h2
          id="login-title"
          className="text-2xl text-stone-800 mb-1"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          {loginData.title}
        </h2>
        <p className="text-sm text-stone-400 mb-6 leading-relaxed">
          {loginData.subtitle}
        </p>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="login-email" className="block text-xs font-semibold text-stone-700 mb-1.5 tracking-wide">
              {loginData.emailLabel}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4l6 4 6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="1.5" y="3" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </span>
              <input
                id="login-email"
                type="email"
                placeholder={loginData.emailPlaceholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                }}
                autoComplete="email"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all duration-200 outline-none
                  ${errors.email
                    ? 'border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-stone-200 bg-stone-50 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100'
                  }
                `}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M6 3.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="6" cy="8.5" r="0.6" fill="currentColor" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="login-password" className="block text-xs font-semibold text-stone-700 mb-1.5 tracking-wide">
              {loginData.passwordLabel}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  <circle cx="8" cy="10.5" r="1" fill="currentColor" />
                </svg>
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder={loginData.passwordPlaceholder}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                }}
                autoComplete="current-password"
                className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm transition-all duration-200 outline-none
                  ${errors.password
                    ? 'border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-stone-200 bg-stone-50 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100'
                  }
                `}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-orange-500 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 2l12 12M6.5 6.5a2 2 0 002.8 2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    <path d="M4.2 4.2C2.7 5.3 1.5 7 1.5 8c0 2 3 5 6.5 5 1.2 0 2.3-.3 3.3-.8M10.5 7a2 2 0 00-2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    <path d="M14.5 8c0-2-3-5-6.5-5-.5 0-1 .05-1.5.15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1.5 8c0 2 3 5 6.5 5s6.5-3 6.5-5-3-5-6.5-5S1.5 6 1.5 8z" stroke="currentColor" strokeWidth="1.3" />
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M6 3.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="6" cy="8.5" r="0.6" fill="currentColor" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between mb-5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="appearance-none w-4 h-4 rounded border-[1.5px] border-stone-300 bg-stone-50 checked:bg-orange-500 checked:border-orange-500 transition-all duration-200 relative
                  after:content-[''] after:absolute after:top-[2px] after:left-[4.5px] after:w-[4px] after:h-[7px] after:border-white after:border-solid after:border-r-[1.5px] after:border-b-[1.5px] after:rotate-45 after:opacity-0 checked:after:opacity-100 cursor-pointer"
              />
              <span className="text-xs text-stone-500 font-medium">{loginData.rememberLabel}</span>
            </label>
            <a href="#" className="text-xs text-orange-500 font-semibold hover:text-orange-600 transition-colors">
              {loginData.forgotLabel}
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-semibold shadow-lg shadow-orange-200/50 hover:shadow-orange-300/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
            id="login-submit-btn"
          >
            {/* Shimmer effect */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12" />
            <span className="relative">{isSubmitting ? loginData.submittingLabel : loginData.submitLabel}</span>
          </button>
        </form>

        {/* ── Divider ── */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <span className="relative bg-white px-3 text-xs text-stone-400 font-medium">
            {loginData.divider}
          </span>
        </div>

        {/* ── Google Button ── */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 rounded-xl border-[1.5px] border-stone-200 bg-white text-sm text-stone-700 font-medium flex items-center justify-center gap-2.5 hover:border-orange-400 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
          id="login-google-btn"
        >
          <GoogleLogo />
          {loginData.googleLabel}
        </button>

        {/* ── Sign Up ── */}
        <p className="text-center mt-6 text-xs text-stone-400">
          {loginData.signupText}{' '}
          <button 
            type="button" 
            onClick={() => { 
              onClose()
              if (onRegister) onRegister() 
            }} 
            className="text-orange-500 font-semibold hover:text-orange-600 transition-colors cursor-pointer"
          >
            {loginData.signupLink}
          </button>
        </p>
      </div>
    </div>
  )
}
