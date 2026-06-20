import { supabase } from '../lib/supabaseClient';
import type { LoveResultDbRow } from '../types';

/**
 * POST: Inserts a new compatibility record into the database.
 * Resolves to the newly created row.
 */
export const storeNewResult = async (
  normalizedYourName: string,
  normalizedCrushName: string,
  score: number
): Promise<LoveResultDbRow> => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }

  const { data, error } = await supabase
    .from('love_results')
    .insert({
      your_name: normalizedYourName,
      crush_name: normalizedCrushName,
      score,
      created_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
};
