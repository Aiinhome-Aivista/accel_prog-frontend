import React from "react";
import LogoIcon from "../assets/logogod.svg";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close logout modal"
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

        <h2 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Confirm Logout</h2>
        <div className="modal-sub" style={{ marginBottom: '2rem' }}>
          Are you sure you want to sign out of your account?
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            className="form-submit"
            onClick={onConfirm}
            style={{ 
              background: 'linear-gradient(to bottom right, #E87A2E, #D06A20)',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Yes, Sign Out
          </button>
          <button
            onClick={onClose}
            style={{ 
              background: 'transparent',
              color: '#6B6D7B',
              border: '1px solid #E5DDD4',
              padding: '0.75rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
