import React, { createContext, useContext, useRef } from 'react';
import type { ReactNode } from 'react';
import { Toast } from 'primereact/toast';
import type { ToastMessage } from 'primereact/toast';

interface ToastContextType {
  showToast: (message: ToastMessage) => void;
  showSuccess: (summary: string, detail?: string) => void;
  showError: (summary: string, detail?: string) => void;
  showWarn: (summary: string, detail?: string) => void;
  showInfo: (summary: string, detail?: string) => void;
  showIncompleteFormToast: (incompleteFields: string[]) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toast = useRef<Toast>(null);

  const showToast = (message: ToastMessage) => {
    toast.current?.show(message);
  };

  const showSuccess = (summary: string, detail?: string) => {
    showToast({ severity: 'success', summary, detail, life: 3000 });
  };

  const showError = (summary: string, detail?: string) => {
    showToast({ severity: 'error', summary, detail, life: 4000 });
  };

  const showWarn = (summary: string, detail?: string) => {
    showToast({ severity: 'warn', summary, detail, life: 3000 });
  };

  const showInfo = (summary: string, detail?: string) => {
    showToast({ severity: 'info', summary, detail, life: 3000 });
  };

  const showIncompleteFormToast = (incomplete: string[]) => {
    if (incomplete.length === 0) return;

    showToast({
      severity: 'warn',
      life: 6000,
      content: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.9rem 1.1rem', width: '100%' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#b45309' }}>
            Incomplete Form
          </span>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.5 }}>
            Please fill in the following required fields before submitting:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {incomplete.slice(0, 5).map((f) => (
              <span
                key={f}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '50px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  background: 'rgba(234, 88, 12, 0.08)',
                  color: '#ea580c',
                  border: '1px solid rgba(234, 88, 12, 0.2)',
                }}
              >
                <span style={{ fontSize: '0.65rem' }}>●</span> {f}
              </span>
            ))}
            {incomplete.length > 5 && (
              <span
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '50px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  background: '#f3f4f6',
                  color: '#6b7280',
                }}
              >
                +{incomplete.length - 5} more
              </span>
            )}
          </div>
        </div>
      ),
    });
  };

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarn, showInfo, showIncompleteFormToast }}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
};
