export interface User {
  id: string;
  farcasterId: string;
  userAddress: string | null;
  paidCredits: number;
  createdAt: string;
  updatedAt: string;
}

export interface Right {
  id: string;
  title: string;
  complexDescription: string;
  simplifiedDescription: string;
  category: string;
  keywords: string[];
  nextSteps: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LookupHistory {
  id: string;
  userId: string;
  rightId: string | null;
  query: string;
  result: SearchResult;
  timestamp: string;
}

export interface Payment {
  id: string;
  userId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  creditsPurchased: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  title: string;
  simplifiedDescription: string;
  nextSteps: string[];
  category: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
}

export interface UserSession {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
