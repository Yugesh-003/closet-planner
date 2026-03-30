// Common types for ClosetMind backend

export interface User {
  userId: string;
  email: string;
  name: string;
  notificationsEnabled: boolean;
  createdAt: string;
}

export interface WardrobeItem {
  userId: string;
  itemId: string;
  name: string;
  type: string;
  category: string;
  color: string;
  fabric: string;
  occasion: string[];
  comfort: string;
  weatherSuitability: string[];
  lastWorn?: string;
  timesWorn: number;
  imageUrl?: string;
  createdAt: string;
}

export interface Outfit {
  userId: string;
  date: string;
  itemIds: string[];
  eventType?: string;
  createdAt: string;
}

export interface Event {
  userId: string;
  eventId: string;
  title: string;
  date: string;
  type: string;
  createdAt: string;
}

export interface OutfitSuggestion {
  items: WardrobeItem[];
  reasoning: string[];
  score: number;
}

export interface AnalyticsData {
  mostWornItems: WardrobeItem[];
  leastWornItems: WardrobeItem[];
  outfitFrequency: Record<string, number>;
}

export interface AuthContext {
  userId: string;
  email: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  body: string;
  headers: Record<string, string>;
}
