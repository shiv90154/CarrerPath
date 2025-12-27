export interface CurrentAffair {
  _id: string;
  title: string;
  description: string;
  detailedContent: string;
  category: string;
  date: string;
  month: string;
  year: number;
  isPublished: boolean;
  tags: string[];
  relatedExams: string[];
  source?: string;
  importanceLevel: 'High' | 'Medium' | 'Low';
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentAffairFilters {
  category?: string;
  year?: number;
  month?: string;
  search?: string;
  importanceLevel?: string;
  page?: number;
  limit?: number;
}

export interface CurrentAffairFormData {
  title: string;
  description: string;
  detailedContent: string;
  category: string;
  date: string;
  tags: string[];
  relatedExams: string[];
  source?: string;
  importanceLevel: 'High' | 'Medium' | 'Low';
}

export interface FilterOptions {
  years: number[];
  months: string[];
  categories: string[];
}

export interface PaginationData {
  total: number;
  page: number;
  pages: number;
  limit: number;
}