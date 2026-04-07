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
