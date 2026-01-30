const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const questionAPI = {
  // Upload CSV file for a company
  uploadQuestions: async (file: File, company: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('company', company);

    const response = await fetch(`${API_BASE_URL}/questions/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload questions');
    }

    return response.json();
  },

  // Get all questions
  getAllQuestions: async () => {
    const response = await fetch(`${API_BASE_URL}/questions`);

    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    return response.json();
  },

  // Get questions by company
  getQuestionsByCompany: async (company: string) => {
    const response = await fetch(`${API_BASE_URL}/questions/company/${encodeURIComponent(company)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch company questions');
    }

    return response.json();
  },

  // Get all companies with stats
  getAllCompanies: async () => {
    const response = await fetch(`${API_BASE_URL}/questions/companies/all`);

    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }

    return response.json();
  },

  // Delete all questions for a company
  deleteCompanyQuestions: async (company: string) => {
    const response = await fetch(`${API_BASE_URL}/questions/company/${encodeURIComponent(company)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete company questions');
    }

    return response.json();
  },
};

export const progressAPI = {
  // Toggle question completion
  toggleComplete: async (questionId: string) => {
    const response = await fetch(`${API_BASE_URL}/progress/toggle/${questionId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to toggle question completion');
    }

    return response.json();
  },

  // Get daily progress
  getDailyProgress: async () => {
    const response = await fetch(`${API_BASE_URL}/progress/daily`);

    if (!response.ok) {
      throw new Error('Failed to fetch daily progress');
    }

    return response.json();
  },

  // Get overall stats
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/progress/stats`);

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return response.json();
  },
};
