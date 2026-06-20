import { supabase } from '../lib/supabaseClient';
import { normalizeAndSortNames, getRandomText } from '../utils';
import { searchExistingResult } from './searchExistingResult';
import { storeNewResult } from './storeNewResult';

export interface LoveResult {
  id?: number;
  your_name: string;
  crush_name: string;
  score: number;
  message: string;
  paragraph: string;
  created_at?: string;
}

/**
 * Local fallback generator for when Supabase is offline or not configured.
 * Keeps the score deterministic for the same name pair, but message and description
 * can be different each time.
 */
export const getLocalFallbackResult = (
  yourName: string,
  crushName: string,
  generatedData?: { score: number }
): LoveResult => {
  const cleanYour = yourName.trim().toLowerCase();
  const cleanCrush = crushName.trim().toLowerCase();

  if (cleanYour === cleanCrush) {
    const { message, paragraph } = getRandomText(100);
    return {
      your_name: cleanYour,
      crush_name: cleanCrush,
      score: 100,
      message,
      paragraph,
    };
  }

  const [normalizedYourName, normalizedCrushName] = normalizeAndSortNames(yourName, crushName);

  let score: number;
  if (generatedData && typeof generatedData.score === 'number') {
    score = generatedData.score;
  } else {
    // Check if either name contains the substring 'pranav' (case-insensitive, as names are already normalized to lowercase)
    const hasPranav = normalizedYourName.includes('pranav') || normalizedCrushName.includes('pranav');
    const minScore = hasPranav ? 95 : 70;
    const maxScore = 100;

    // Generate a deterministic score based on the name pair
    const key = `${normalizedYourName}:${normalizedCrushName}`;
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }
    score = Math.floor(Math.abs(hash) % (maxScore - minScore + 1)) + minScore;
  }

  const { message, paragraph } = getRandomText(score);

  return {
    your_name: normalizedYourName,
    crush_name: normalizedCrushName,
    score,
    message,
    paragraph,
  };
};

// Global map to keep track of active database queries/inserts in-flight
// to prevent concurrent race conditions (e.g. from React 18 StrictMode double-mount effects)
const inflightRequests = new Map<string, Promise<LoveResult>>();

const findLocalResult = (yourName: string, crushName: string): any | null => {
  try {
    const raw = localStorage.getItem('love_results_history');
    if (!raw) return null;
    const list = JSON.parse(raw) as any[];
    return list.find(
      (item) =>
        (item.your_name === yourName && item.crush_name === crushName) ||
        (item.your_name === crushName && item.crush_name === yourName)
    ) || null;
  } catch (e) {
    console.error('Error finding local result:', e);
    return null;
  }
};

const saveFallbackToLocalStorage = (result: LoveResult) => {
  try {
    const raw = localStorage.getItem('love_results_history');
    const list = raw ? JSON.parse(raw) : [];
    const newRow = {
      id: result.id,
      your_name: result.your_name,
      crush_name: result.crush_name,
      score: result.score,
      created_at: result.created_at,
    };
    list.push(newRow);
    localStorage.setItem('love_results_history', JSON.stringify(list));
  } catch (e) {
    console.error('Error saving local result:', e);
  }
};

/**
 * Main service function to get an existing love result or insert a new one if it does not exist.
 * Fallbacks to local calculation if Supabase is not configured or fails.
 */
export const getOrCreateLoveResult = (
  yourName: string,
  crushName: string,
  generatedData?: { score: number }
): Promise<LoveResult> => {
  const cleanYour = yourName.trim().toLowerCase();
  const cleanCrush = crushName.trim().toLowerCase();

  if (cleanYour === cleanCrush) {
    const { message, paragraph } = getRandomText(100);
    return Promise.resolve({
      your_name: cleanYour,
      crush_name: cleanCrush,
      score: 100,
      message,
      paragraph,
    });
  }

  const [normalizedYourName, normalizedCrushName] = normalizeAndSortNames(yourName, crushName);
  const key = `${normalizedYourName}:${normalizedCrushName}`;

  // If there's an in-flight promise for this pair, return it to prevent duplicate select/inserts
  if (inflightRequests.has(key)) {
    return inflightRequests.get(key)!;
  }

  const promise = (async (): Promise<LoveResult> => {
    // If Supabase client is not available (e.g., missing env variables), use local fallback
    if (!supabase) {
      console.warn('Supabase is not initialized. Using local fallback.');
      const existing = findLocalResult(normalizedYourName, normalizedCrushName);
      if (existing) {
        const { message, paragraph } = getRandomText(existing.score);
        return {
          id: existing.id,
          your_name: normalizedYourName,
          crush_name: normalizedCrushName,
          score: existing.score,
          message,
          paragraph,
          created_at: existing.created_at,
        };
      }
      const res = getLocalFallbackResult(yourName, crushName, generatedData);
      res.id = Date.now();
      res.created_at = new Date().toISOString();
      saveFallbackToLocalStorage(res);
      return res;
    }

    try {
      // 1. GET: Check for existing record in its dedicated file
      const existingRecord = await searchExistingResult(normalizedYourName, normalizedCrushName);

      if (existingRecord) {
        const { message, paragraph } = getRandomText(existingRecord.score);

        return {
          id: existingRecord.id,
          your_name: normalizedYourName,
          crush_name: normalizedCrushName,
          score: existingRecord.score,
          message,
          paragraph,
          created_at: existingRecord.created_at,
        };
      }

      // 2. POST: No record exists, insert a new one in its dedicated file
      // Generate a random score if score not already pre-provided
      let score: number;
      if (generatedData && typeof generatedData.score === 'number') {
        score = generatedData.score;
      } else {
        const hasPranav = normalizedYourName.includes('pranav') || normalizedCrushName.includes('pranav');
        const minScore = hasPranav ? 95 : 70;
        const maxScore = 100;
        score = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;
      }

      const newRecord = await storeNewResult(normalizedYourName, normalizedCrushName, score);

      const { message, paragraph } = getRandomText(newRecord.score);

      return {
        id: newRecord.id,
        your_name: normalizedYourName,
        crush_name: normalizedCrushName,
        score: newRecord.score,
        message,
        paragraph,
        created_at: newRecord.created_at,
      };
    } catch (error) {
      console.error('Supabase query/insert failed. Using local fallback:', error);
      const existing = findLocalResult(normalizedYourName, normalizedCrushName);
      if (existing) {
        const { message, paragraph } = getRandomText(existing.score);
        return {
          id: existing.id,
          your_name: normalizedYourName,
          crush_name: normalizedCrushName,
          score: existing.score,
          message,
          paragraph,
          created_at: existing.created_at,
        };
      }
      const res = getLocalFallbackResult(yourName, crushName, generatedData);
      res.id = Date.now();
      res.created_at = new Date().toISOString();
      saveFallbackToLocalStorage(res);
      return res;
    }
  })();

  // Cache the active promise
  inflightRequests.set(key, promise);

  // Clean up when the promise resolves or rejects
  promise.finally(() => {
    inflightRequests.delete(key);
  });

  return promise;
};
