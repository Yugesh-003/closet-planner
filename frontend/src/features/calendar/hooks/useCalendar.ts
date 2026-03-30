import { useState, useEffect } from 'react';
import apiClient from '../../../lib/api';

export interface Outfit {
  date: string;
  itemIds: string[];
  eventType?: string;
}

export function useCalendar() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOutfits = async (month: string) => {
    try {
      const response = await apiClient.get(`/calendar?month=${month}`);
      setOutfits(response.data.outfits || []);
    } catch (error) {
      console.error('Failed to fetch calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const logOutfit = async (outfit: Outfit) => {
    try {
      await apiClient.post('/outfit', outfit);
      await fetchOutfits(outfit.date.substring(0, 7));
    } catch (error) {
      console.error('Failed to log outfit:', error);
      throw error;
    }
  };

  return { outfits, loading, logOutfit, fetchOutfits };
}
