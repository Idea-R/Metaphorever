import { IdiomAnalysisResult } from '../types';

const CACHE_KEY = 'metaphorever-idiom-cache';
const MAX_CACHE_SIZE = 100;

interface CacheEntry {
  result: IdiomAnalysisResult;
  timestamp: number;
}

interface Cache {
  [key: string]: CacheEntry;
}

// Load cache from localStorage
const loadCache = (): Cache => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
};

// Save cache to localStorage
const saveCache = (cache: Cache) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to save cache:', error);
  }
};

// Clean old entries (older than 7 days)
const cleanCache = (cache: Cache): Cache => {
  const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  const now = Date.now();
  
  return Object.entries(cache).reduce((acc, [key, entry]) => {
    if (now - entry.timestamp < oneWeek) {
      acc[key] = entry;
    }
    return acc;
  }, {} as Cache);
};

// Trim cache to maximum size
const trimCache = (cache: Cache): Cache => {
  const entries = Object.entries(cache);
  if (entries.length <= MAX_CACHE_SIZE) return cache;
  
  // Sort by timestamp (newest first) and take only MAX_CACHE_SIZE entries
  const trimmed = entries
    .sort(([, a], [, b]) => b.timestamp - a.timestamp)
    .slice(0, MAX_CACHE_SIZE);
  
  return Object.fromEntries(trimmed);
};

export const getCachedAnalysis = (text: string): IdiomAnalysisResult | null => {
  const cache = loadCache();
  const entry = cache[text];
  return entry ? entry.result : null;
};

export const setCachedAnalysis = (text: string, result: IdiomAnalysisResult): void => {
  let cache = loadCache();
  
  // Clean old entries
  cache = cleanCache(cache);
  
  // Add new entry
  cache[text] = {
    result,
    timestamp: Date.now(),
  };
  
  // Trim if necessary
  cache = trimCache(cache);
  
  // Save updated cache
  saveCache(cache);
};