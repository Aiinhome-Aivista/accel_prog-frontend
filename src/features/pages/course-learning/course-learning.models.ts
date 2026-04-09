export interface NavItem {
  id: string;
  l: string; // Label
  i: React.ReactNode; // Icon node
  c?: number; // Count/badge
}

export interface TopicDay {
  d: string;
  t: string;
  n: string;
}

export interface Question {
  q: string;
  type: 'subjective' | 'mcq';
  opts?: string[];
  ans?: number; // Correct option index
}

export interface AssessmentQuestions {
  critical: Question[];
  technical: Question[];
  problem: Question[];
  subjective: Question[];
}

export interface TopicSeed {
  n: string; // Name
  a: string; // Initials
  tm: string; // Time
  tx: string; // Text
  lk: number; // Likes
}

export interface SubTopic {
  id: string;
  type: 'reading' | 'video' | 'assess' | 'discussion' | 'project';
  title: string;
  content?: string; // HTML content for reading
  videoTitle?: string;
  videoDesc?: string;
  questions?: AssessmentQuestions;
  topic?: string; // Discussion topic
  seeds?: TopicSeed[];
  brief?: string; // Project brief
  reqs?: string[]; // Project requirements
}

export interface WeekData {
  id: string;
  t: string; // Title
  short: string;
  ul: boolean; // Unlocked
  color: string;
  topics: TopicDay[];
  subs: SubTopic[];
  moduleId: number;
}

export interface Flashcard {
  q: string;
  a: string;
}

export interface Person {
  n: string; // Name
  r: string; // Role
  a: string; // Initials
  bg: string;
  c: string; // Text Color
}

export interface Announcement {
  t: string;
  tx: string;
  tm: string;
}

export interface ApiContent {
  data: string | null;
  type: string;
}

export interface ApiTopic {
  content: ApiContent;
  is_completed: boolean;
  subtitle: string | null;
  subtopic_id: number;
  title: string;
  type: "reading" | "video" | "assessment" | "discussion" | "project";
}

export interface ApiProgress {
  completed_topics: number;
  percentage: number;
  total_topics: number;
}

export interface ApiWeek {
  is_locked: boolean;
  module_id: number;
  module_name: string;
  progress: ApiProgress | null;
  topics: ApiTopic[];
  week: number;
}

export interface CourseLearningContent {
  course_id: number;
  course_name: string;
  weeks: ApiWeek[];
}
