import { useState, useEffect } from 'react';
import apiClient from '../../../lib/api';

export interface Event {
  eventId: string;
  title: string;
  date: string;
  type: string;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await apiClient.get('/events');
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (event: Omit<Event, 'eventId'>) => {
    try {
      await apiClient.post('/events', event);
      await fetchEvents();
    } catch (error) {
      console.error('Failed to add event:', error);
      throw error;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await apiClient.delete(`/events/${eventId}`);
      await fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, addEvent, deleteEvent, refetch: fetchEvents };
}
