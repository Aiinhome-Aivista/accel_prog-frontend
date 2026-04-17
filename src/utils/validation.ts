/**
 * Validation utility for registration fields.
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Supports formats like +91 9876543210, 9876543210, +1 123 456 7890
  // Removes spaces, dashes, and parentheses before validation
  const cleaned = phone.replace(/[\s\-()]/g, "");
  const phoneRegex = /^(\+?\d{1,3})?\d{10}$/;
  return phoneRegex.test(cleaned);
};

export const validateRequired = (value: any): boolean => {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return true;
  return !!value;
};

export type ValidationType = "email" | "tel" | "text" | "number" | "select" | "chips" | "scale" | "textarea";

export const validateField = (type: ValidationType, value: any, required: boolean = false): string | null => {
  if (required && !validateRequired(value)) {
    return "This field is required. Please provide an answer.";
  }

  if (!value || (typeof value === "string" && value.trim() === "")) {
    return null; // Not required and empty is fine
  }

  switch (type) {
    case "email":
      return validateEmail(String(value)) ? null : "That doesn't look like a valid email address. Could you check it again?";
    case "tel":
      return validatePhone(String(value)) ? null : "Please enter a valid 10-digit phone number (with optional country code).";
    default:
      return null;
  }
};
