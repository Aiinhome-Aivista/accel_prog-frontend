interface SignInModalProps {
    open: boolean
    onClose: () => void
    onSignIn: () => void
}

function SignInModal({ open, onClose, onSignIn }: SignInModalProps) {
    if (!open) return null

    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="modal" onClick={(event) => event.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close sign in modal">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>

                <div className="modal-brand">
                    <svg width="30" height="30" viewBox="0 0 42 42" fill="none" aria-hidden="true">
                        <circle cx="21" cy="14" r="6" fill="#E87A2E" />
                        <path d="M21 20c-6 0-10 3-10 7 0 2 1 3 2 4l2-3c1-1.5 2.5-2 3-2h6c.5 0 2 .5 3 2l2 3c1-1 2-2 2-4 0-4-4-7-10-7z" fill="#E87A2E" />
                    </svg>
                    <span>
                        Moksh<em>Path</em>
                    </span>
                </div>

                <h2>Sign In</h2>
                <div className="modal-sub">Access your courses and track your progress.</div>

                <div className="form-group">
                    <label htmlFor="signin-email">Email</label>
                    <input id="signin-email" type="email" placeholder="you@example.com" />
                </div>

                <div className="form-group">
                    <label htmlFor="signin-password">Password</label>
                    <input id="signin-password" type="password" placeholder="Enter your password" />
                </div>

                <button className="form-submit" onClick={onSignIn}>
                    Sign In
                </button>

                <div className="form-divider">or</div>

                <button className="btn-google" onClick={onSignIn}>
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
