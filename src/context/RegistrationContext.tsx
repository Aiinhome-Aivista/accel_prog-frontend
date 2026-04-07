import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { FormDataMap, FormValue } from '../types/registration';
import { REG_SCHEMA } from '../data/registrationSchema';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface RegistrationContextType {
  formData: FormDataMap;
  currentSection: number;
  submitted: boolean;
  progressPct: number;
  updateField: (id: string, value: FormValue) => void;
  toggleChip: (fieldId: string, value: string) => void;
  goToSection: (index: number) => void;
  isSectionComplete: (index: number) => boolean;
  submitForm: () => Promise<void>;
  resetRegistration: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showIncompleteFormToast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<FormDataMap>(() => {
    try {
      const saved = localStorage.getItem("reg_form");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [currentSection, setCurrentSection] = useState(() => {
    return Number(localStorage.getItem("reg_section")) || 0;
  });

  const [submitted, setSubmitted] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("reg_form", JSON.stringify(formData));
    localStorage.setItem("reg_section", String(currentSection));
  }, [formData, currentSection]);

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user, formData.email]);

  const updateField = (id: string, value: FormValue) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const toggleChip = (fieldId: string, value: string) => {
    setFormData((prev) => {
      const existing = Array.isArray(prev[fieldId]) ? [...(prev[fieldId] as string[])] : [];
      const idx = existing.indexOf(value);
      idx >= 0 ? existing.splice(idx, 1) : existing.push(value);
      return { ...prev, [fieldId]: existing };
    });
  };

  const goToSection = (index: number) => {
    if (index >= 0 && index < REG_SCHEMA.length) {
      setCurrentSection(index);
      window.scrollTo(0, 0);
    }
  };

  const isSectionComplete = (idx: number) => {
    const section = REG_SCHEMA[idx];
    if (!section) return false;
    
    const requiredFields = section.fields.filter((field) => field.required);
    if (requiredFields.length === 0) {
      return section.fields.some((field) => {
        const val = formData[field.id];
        if (Array.isArray(val)) return val.length > 0;
        return val !== undefined && String(val).trim() !== "";
      });
    }
    return requiredFields.every((field) => {
      const val = formData[field.id];
      if (Array.isArray(val)) return val.length > 0;
      return val !== undefined && String(val).trim() !== "";
    });
  };

  const progressPct = useMemo(() => {
    let filled = 0;
    let total = 0;
    REG_SCHEMA.forEach((section) => {
      section.fields.forEach((field) => {
        total += 1;
        const val = formData[field.id];
        if (Array.isArray(val) && val.length > 0) filled += 1;
        else if (val !== undefined && String(val).trim() !== "") filled += 1;
      });
    });
    return total === 0 ? 0 : (submitted ? 100 : Math.round((filled / total) * 100));
  }, [formData, submitted]);

  const buildCompletePayload = () => {
    const payload: FormDataMap = {};
    REG_SCHEMA.forEach((section) => {
      section.fields.forEach((field) => {
        const val = formData[field.id];
        if (val === undefined) {
          payload[field.id] = field.type === "chips" ? [] : "";
        } else {
          payload[field.id] = val;
        }
      });
    });
    return payload;
  };

  const submitForm = async () => {
    const incomplete: string[] = [];
    REG_SCHEMA.forEach((section) => {
      section.fields.filter((field) => field.required).forEach((field) => {
        const val = formData[field.id];
        const filled = Array.isArray(val) ? val.length > 0 : val !== undefined && String(val).trim() !== "";
        if (!filled) incomplete.push(field.label);
      });
    });

    if (incomplete.length > 0) {
      showIncompleteFormToast(incomplete);
      return;
    }

    const completeData = buildCompletePayload();
    try {
      const response = await authService.registration(completeData);
      if (response.status === "success") {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  const resetRegistration = () => {
    setFormData({});
    setCurrentSection(0);
    setSubmitted(false);
    localStorage.removeItem("reg_form");
    localStorage.removeItem("reg_section");
  };

  const value = {
    formData,
    currentSection,
    submitted,
    progressPct,
    updateField,
    toggleChip,
    goToSection,
    isSectionComplete,
    submitForm,
    resetRegistration
  };

  return <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>;
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};
