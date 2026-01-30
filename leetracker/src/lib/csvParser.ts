import { Question } from '@/types/question';

export const parseCSV = (content: string): Omit<Question, 'id' | 'company'>[] => {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const difficultyIndex = headers.findIndex(h => h.includes('difficulty'));
  const titleIndex = headers.findIndex(h => h.includes('title'));
  const frequencyIndex = headers.findIndex(h => h.includes('frequency'));
  const acceptanceIndex = headers.findIndex(h => h.includes('acceptance'));
  const linkIndex = headers.findIndex(h => h.includes('link'));
  const topicsIndex = headers.findIndex(h => h.includes('topic'));
  const completedIndex = headers.findIndex(h => h.includes('completed'));
  
  const questions: Omit<Question, 'id' | 'company'>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 2) continue;
    
    const difficulty = parseDifficulty(values[difficultyIndex] || 'Medium');
    const title = values[titleIndex]?.trim() || `Question ${i}`;
    const frequency = parseFloat(values[frequencyIndex]) || 0;
    const acceptanceRate = parseFloat(values[acceptanceIndex]?.replace('%', '')) || 0;
    const link = values[linkIndex]?.trim() || '';
    const topics = parseTopics(values[topicsIndex] || '');
    const completed = parseBoolean(values[completedIndex]);
    
    questions.push({
      difficulty,
      title,
      frequency,
      acceptanceRate,
      link,
      topics,
      completed,
    });
  }
  
  return questions;
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

const parseDifficulty = (value: string): 'Easy' | 'Medium' | 'Hard' => {
  const lower = value.toLowerCase().trim();
  if (lower.includes('easy')) return 'Easy';
  if (lower.includes('hard')) return 'Hard';
  return 'Medium';
};

const parseTopics = (value: string): string[] => {
  if (!value) return [];
  return value
    .replace(/[\[\]"]/g, '')
    .split(/[,;|]/)
    .map(t => t.trim())
    .filter(t => t.length > 0);
};

const parseBoolean = (value: string | undefined): boolean => {
  if (!value) return false;
  const lower = value.toLowerCase().trim();
  return lower === 'true' || lower === 'yes' || lower === '1';
};
