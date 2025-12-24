export interface Task {
  id: string;
  title: string;
  completed: boolean;
  tag: 'Study' | 'Health' | 'Life' | 'Work';
  time?: string;
}

export type IconType = 'Link' | 'Notion' | 'Google' | 'YouTube' | 'Figma' | 'Code';

export interface QuickLink {
  id: string;
  label: string;
  url: string;
  icon: IconType;
}

export interface Book {
  title: string;
  author: string;
  currentPage: number;
  totalPages: number;
  coverUrl?: string;
}

export interface Habit {
  id: string;
  name: string;
  value: number;
  color: string;
}

export interface WeeklyMetric {
  day: string;
  score: number;
}

export interface UniApplication {
  id: string;
  university: string;
  type: 'Reach' | 'Target' | 'Safety';
  deadline: string;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Accepted';
}

export interface Project {
  id: string;
  title: string;
  status: 'Active' | 'Paused' | 'Done';
  progress: number;
}