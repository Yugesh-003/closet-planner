import { useState } from 'react';
import apiClient from '../../../lib/api';

export interface Suggestion {
  items: Array<{
    itemId: string;
    name: string;
    type: string;
    color: string;
  }>;
  reason: string;
}

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const getSuggestions = async (eventType?: string) => {
    setLoading(true);
    try {
      const params = eventType ? `?eventType=${eventType}` : '';
      const response = await apiClient.get(`/suggestions${params}`);
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  return { suggestions, loading, getSuggestions };
}
