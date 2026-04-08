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
