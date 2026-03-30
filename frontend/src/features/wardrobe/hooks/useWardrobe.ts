import { useState, useEffect } from 'react';
import apiClient from '../../../lib/api';

export interface WardrobeItem {
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
}

export function useWardrobe() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const response = await apiClient.get('/wardrobe');
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Failed to fetch wardrobe:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<WardrobeItem, 'itemId' | 'timesWorn'>) => {
    try {
      await apiClient.post('/wardrobe', item);
      await fetchItems();
    } catch (error) {
      console.error('Failed to add item:', error);
      throw error;
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await apiClient.delete(`/wardrobe/${itemId}`);
      await fetchItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return { items, loading, addItem, deleteItem, refetch: fetchItems };
}
