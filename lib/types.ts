export interface User {
  farcasterId: string;
  userAddress: string;
  paidCredits: number;
}

export interface Right {
  id: string;
  title: string;
  complexDescription: string;
  simplifiedDescription: string;
  category: string;
  keywords: string[];
  nextSteps: string[];
}

export interface LookupHistory {
  userId: string;
  rightId: string;
  timestamp: Date;
}

export interface SearchResult {
  title: string;
  simplifiedDescription: string;
  nextSteps: string[];
  category: string;
}
