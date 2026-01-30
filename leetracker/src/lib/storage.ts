import { Question, CompanyData, DailyProgress } from '@/types/question';

const QUESTIONS_KEY = 'leettrack_questions';
const PROGRESS_KEY = 'leettrack_progress';

export const getStoredQuestions = (): Question[] => {
  const stored = localStorage.getItem(QUESTIONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveQuestions = (questions: Question[]): void => {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
};

export const addQuestionsForCompany = (companyName: string, newQuestions: Omit<Question, 'id' | 'company'>[]): void => {
  const existing = getStoredQuestions();
  
  const questionsWithIds = newQuestions.map((q, index) => ({
    ...q,
    id: `${companyName}-${q.title}-${Date.now()}-${index}`,
    company: companyName,
  }));
  
  const updated = [...existing, ...questionsWithIds];
  saveQuestions(updated);
};

export const getCompanyData = (): CompanyData[] => {
  const questions = getStoredQuestions();
  const companyMap = new Map<string, Question[]>();
  
  questions.forEach(q => {
    const existing = companyMap.get(q.company) || [];
    companyMap.set(q.company, [...existing, q]);
  });
  
  return Array.from(companyMap.entries()).map(([name, questions]) => ({
    name,
    questions,
    totalQuestions: questions.length,
    completedQuestions: questions.filter(q => q.completed).length,
    easyCount: questions.filter(q => q.difficulty === 'Easy').length,
    mediumCount: questions.filter(q => q.difficulty === 'Medium').length,
    hardCount: questions.filter(q => q.difficulty === 'Hard').length,
  }));
};

export const getAllUniqueQuestions = (): Question[] => {
  const questions = getStoredQuestions();
  const uniqueMap = new Map<string, Question>();
  
  questions.forEach(q => {
    const key = q.title.toLowerCase().trim();
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, q);
    }
  });
  
  return Array.from(uniqueMap.values());
};

export const toggleQuestionComplete = (questionId: string): void => {
  const questions = getStoredQuestions();
  const question = questions.find(q => q.id === questionId);
  
  if (question) {
    question.completed = !question.completed;
    saveQuestions(questions);
    
    if (question.completed) {
      addToProgress(questionId);
    } else {
      removeFromProgress(questionId);
    }
  }
};

export const getDailyProgress = (): DailyProgress[] => {
  const stored = localStorage.getItem(PROGRESS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToProgress = (questionId: string): void => {
  const progress = getDailyProgress();
  const today = new Date().toISOString().split('T')[0];
  
  const todayProgress = progress.find(p => p.date === today);
  
  if (todayProgress) {
    if (!todayProgress.questions.includes(questionId)) {
      todayProgress.questions.push(questionId);
      todayProgress.count = todayProgress.questions.length;
    }
  } else {
    progress.push({
      date: today,
      count: 1,
      questions: [questionId],
    });
  }
  
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

export const removeFromProgress = (questionId: string): void => {
  const progress = getDailyProgress();
  const today = new Date().toISOString().split('T')[0];
  
  const todayProgress = progress.find(p => p.date === today);
  
  if (todayProgress) {
    todayProgress.questions = todayProgress.questions.filter(id => id !== questionId);
    todayProgress.count = todayProgress.questions.length;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }
};

export const getStreak = (): number => {
  const progress = getDailyProgress();
  if (progress.length === 0) return 0;
  
  const sortedDates = progress
    .filter(p => p.count > 0)
    .map(p => p.date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  if (sortedDates.length === 0) return 0;
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }
  
  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i - 1]);
    const previous = new Date(sortedDates[i]);
    const diffDays = Math.floor((current.getTime() - previous.getTime()) / 86400000);
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const deleteCompany = (companyName: string): void => {
  const questions = getStoredQuestions();
  const filtered = questions.filter(q => q.company !== companyName);
  saveQuestions(filtered);
};

export const clearAllData = (): void => {
  localStorage.removeItem(QUESTIONS_KEY);
  localStorage.removeItem(PROGRESS_KEY);
};
