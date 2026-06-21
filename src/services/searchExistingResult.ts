import { supabase } from '../lib/supabaseClient';
import type { LoveResultDbRow } from '../types';

/**
 * GET: Queries the database for an existing compatibility record.
 * Resolves to the matched row, or null if no record exists.
 */
export const searchExistingResult = async (
  normalizedYourName: string,
  normalizedCrushName: string
): Promise<LoveResultDbRow | null> => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }

  const { data, error } = await supabase
    .from('love_results')
    .select('*')
    .or(`and(your_name.eq.${normalizedYourName},crush_name.eq.${normalizedCrushName}),and(your_name.eq.${normalizedCrushName},crush_name.eq.${normalizedYourName})`)
    .order('created_at', { ascending: true })
    .limit(1);

  if (error) {
    throw error;
  }

  return data && data.length > 0 ? data[0] : null;
};
