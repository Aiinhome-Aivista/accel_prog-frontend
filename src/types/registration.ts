export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "select"
  | "textarea"
  | "chips"
  | "scale";

export interface FieldSchema {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  hint?: string;
  min?: number;
  max?: number;
  labels?: string[];
}

export interface SectionSchema {
  id: string;
  title: string;
  subtitle: string;
  fields: FieldSchema[];
}

export interface CourseModule {
  name: string;
  desc: string;
}

export interface CourseItem {
  label: string;
  title: string;
  focus: string;
  level: string;
  color: 1 | 2 | 3 | 4;
  modules: CourseModule[];
  outcome: string;
}

export type FormValue = string | number | string[];
export type FormDataMap = Record<string, FormValue>;
