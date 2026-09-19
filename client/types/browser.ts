export type LifecycleState = 'typed' | 'loading' | 'shown' | 'history' | 'nowhere';

export interface NavEntry {
  address: string;
  title: string;
  timestamp: number;
  scrollY?: number;
}

export interface Site {
  _id?: string;
  address: string;
  title: string;
  content: string;
  author: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPersona {
  _id?: string;
  username: string;
  avatarColor: string;
  title: string;
}

export interface HistoryItem {
  _id?: string;
  userId: string;
  address: string;
  title: string;
  scrollY?: number;
  visitedAt: string;
}

export interface SearchResultItem {
  address: string;
  title: string;
  author: string;
  snippet: string;
  updatedAt: string;
}
