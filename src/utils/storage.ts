import { Metaphor } from '../types';

// Maximum number of history items to keep
const MAX_HISTORY_ITEMS = 10;

// LocalStorage keys
const FAVORITES_KEY = 'metaphorever-favorites';
const HISTORY_KEY = 'metaphorever-history';

// Get favorites from localStorage
export const getFavorites = (): Metaphor[] => {
  try {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error('Error getting favorites from localStorage:', error);
    return [];
  }
};

// Save favorites to localStorage
export const saveFavorites = (favorites: Metaphor[]): void => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

// Get history from localStorage
export const getHistory = (): Metaphor[] => {
  try {
    const storedHistory = localStorage.getItem(HISTORY_KEY);
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch (error) {
    console.error('Error getting history from localStorage:', error);
    return [];
  }
};

// Save history to localStorage
export const saveHistory = (history: Metaphor[]): void => {
  try {
    // Limit to MAX_HISTORY_ITEMS
    const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error saving history to localStorage:', error);
  }
};

// Add metaphor to history and maintain maximum size
export const addToHistory = (metaphor: Metaphor): Metaphor[] => {
  const history = getHistory();
  // Add to beginning
  const newHistory = [metaphor, ...history.filter(m => m.id !== metaphor.id)];
  // Limit size
  const limitedHistory = newHistory.slice(0, MAX_HISTORY_ITEMS);
  saveHistory(limitedHistory);
  return limitedHistory;
};

// Toggle favorite status for a metaphor
export const toggleFavorite = (metaphor: Metaphor): { favorites: Metaphor[], history: Metaphor[] } => {
  const favorites = getFavorites();
  const history = getHistory();
  
  // Update metaphor in both lists
  const updatedMetaphor = { ...metaphor, isFavorite: !metaphor.isFavorite };
  
  let newFavorites: Metaphor[];
  if (updatedMetaphor.isFavorite) {
    // Add to favorites if not already present
    newFavorites = [updatedMetaphor, ...favorites.filter(f => f.id !== metaphor.id)];
  } else {
    // Remove from favorites
    newFavorites = favorites.filter(f => f.id !== metaphor.id);
  }
  
  // Update history
  const newHistory = history.map(h => 
    h.id === metaphor.id ? updatedMetaphor : h
  );
  
  saveFavorites(newFavorites);
  saveHistory(newHistory);
  
  return { favorites: newFavorites, history: newHistory };
};