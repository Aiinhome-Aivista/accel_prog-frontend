export interface StatItem {
  id: number;
  icon: string;
  iconBg: string;
  value: string;
  label: string;
}

export interface CourseData {
  id: string;
  bannerGradient: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  title: string;
  description: string;
  meta: string[];
  progress?: number;
  progressText?: string;
  progressColor?: string;
  features?: string[];
}

export interface ActivityData {
  id: number;
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
}

export interface DashboardData {
  welcome: {
    title: string;
    streakText: string;
  };
  stats: StatItem[];
  inProgressCourses: CourseData[];
  completedCourses: CourseData[];
  availableCourses: CourseData[];
  activities: ActivityData[];
}

export interface RawDashboardCourse {
  course_id: number;
  course_name: string;
  description: string;
  course_label: string;
  features: string[];
  total_weeks: number;
  total_subtopics: number;
  capstone: string;
}

export interface DashboardKPI {
  completed_count: number;
  in_progress_count: number;
  overall_progress: number;
  streak_days: number;
}

export interface EnrollmentRequest {
  user_id: number;
  course_id: number;
  role_id: number;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface EnrollmentData {
  course_id: number;
  current_module_id: number;
  first_subtopic_id: number;
}

export interface EnrollmentResponse extends ApiResponse<EnrollmentData> {}
export interface EnrolledCourse {
  course_id: number;
  course_name: string;
  description: string;
  progress_pct: number;
  status: string;
  total_projects: number;
  total_subtopics: number;
  total_weeks: number;
}

export interface EnrolledCoursesResponse extends ApiResponse<EnrolledCourse[]> {}
