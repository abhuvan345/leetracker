export interface Question {
  id: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title: string;
  frequency: number;
  acceptanceRate: number;
  link: string;
  topics: string[];
  completed: boolean;
  company: string;
}

export interface CompanyData {
  name: string;
  questions: Question[];
  totalQuestions: number;
  completedQuestions: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}

export interface DailyProgress {
  date: string;
  count: number;
  questions: string[];
}
