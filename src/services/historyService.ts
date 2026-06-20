import { supabase } from '../lib/supabaseClient';
import type { LoveResultDbRow } from '../types';

const LOCAL_STORAGE_KEY = 'love_results_history';

/**
 * Retrieves all compatibility results from Supabase (descending order by time),
 * or falls back to localStorage if Supabase client is not available.
 */
export const fetchLoveResults = async (): Promise<LoveResultDbRow[]> => {
  if (!supabase) {
    console.warn('Supabase is not initialized. Fetching from localStorage.');
    return getLocalResults();
  }

  try {
    const { data, error } = await supabase
      .from('love_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch from Supabase. Falling back to localStorage:', error);
    return getLocalResults();
  }
};

/**
 * Deletes a single compatibility result by ID.
 */
export const deleteLoveResult = async (id: number): Promise<void> => {
  if (!supabase) {
    deleteLocalResult(id);
    return;
  }

  try {
    const { error } = await supabase
      .from('love_results')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Failed to delete ID ${id} from Supabase. Deleting from localStorage:`, error);
    deleteLocalResult(id);
  }
};

/**
 * Deletes multiple compatibility results by their IDs in batch.
 */
export const deleteLoveResults = async (ids: number[]): Promise<void> => {
  if (ids.length === 0) return;

  if (!supabase) {
    deleteLocalResultsBatch(ids);
    return;
  }

  try {
    const { error } = await supabase
      .from('love_results')
      .delete()
      .in('id', ids);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Failed to batch delete IDs from Supabase. Deleting from localStorage:`, error);
    deleteLocalResultsBatch(ids);
  }
};

// Helper methods for localStorage handling

const getLocalResults = (): LoveResultDbRow[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LoveResultDbRow[];
    // Sort descending by created_at
    return parsed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (e) {
    console.error('Error reading history from localStorage:', e);
    return [];
  }
};

const deleteLocalResult = (id: number): void => {
  try {
    const results = getLocalResults();
    const filtered = results.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error deleting from localStorage:', e);
  }
};

const deleteLocalResultsBatch = (ids: number[]): void => {
  try {
    const results = getLocalResults();
    const idSet = new Set(ids);
    const filtered = results.filter((item) => !idSet.has(item.id));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error batch deleting from localStorage:', e);
  }
};
