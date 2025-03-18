import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  reminder: boolean;
  created_by: string;
  created_at: string;
}

interface EventInput {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  reminder: boolean;
}

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  createEvent: (event: EventInput) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  loading: false,
  error: null,
  fetchEvents: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      set({ events: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  createEvent: async (eventInput) => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            ...eventInput,
            created_by: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      
      const events = get().events;
      set({ events: [...events, data] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));

// Initialize events
supabase
  .channel('events')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
    useEventStore.getState().fetchEvents();
  })
  .subscribe();

useEventStore.getState().fetchEvents();