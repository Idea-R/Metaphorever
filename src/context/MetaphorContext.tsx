import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Metaphor, Tone, IdiomAnalysisResult } from '../types';
import { generateMetaphor } from '../services/openaiService';
import { analyzePhrase, getTranslations } from '../services/idiomService';
import { 
  getFavorites, 
  getHistory, 
  addToHistory, 
  toggleFavorite as toggleFavoriteInStorage 
} from '../utils/storage';
import { IdiomAnalysis } from '../components/IdiomAnalysis';

interface MetaphorContextType {
  input: string;
  setInput: (input: string) => void;
  tone: Tone;
  setTone: (tone: Tone) => void;
  currentMetaphor: Metaphor | null;
  favorites: Metaphor[];
  history: Metaphor[];
  isGenerating: boolean;
  error: string | null;
  generateNewMetaphor: () => Promise<void>;
  toggleFavorite: (metaphor: Metaphor) => void;
  copyToClipboard: (text: string) => Promise<boolean>;
  analyzeIdioms: (text: string) => Promise<void>;
  idiomAnalysis: IdiomAnalysisResult | null;
  closeIdiomAnalysis: () => void;
  requestTranslations: (languages: string[]) => Promise<void>;
}

const MetaphorContext = createContext<MetaphorContextType | undefined>(undefined);

export const MetaphorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [input, setInput] = useState<string>('');
  const [tone, setTone] = useState<Tone>('poetic');
  const [currentMetaphor, setCurrentMetaphor] = useState<Metaphor | null>(null);
  const [favorites, setFavorites] = useState<Metaphor[]>([]);
  const [history, setHistory] = useState<Metaphor[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [idiomAnalysis, setIdiomAnalysis] = useState<IdiomAnalysisResult | null>(null);

  useEffect(() => {
    setFavorites(getFavorites());
    setHistory(getHistory());
  }, []);

  const generateNewMetaphor = async (): Promise<void> => {
    if (!input.trim()) {
      setError('Please enter some text to generate a metaphor');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const metaphor = await generateMetaphor(input, tone);
      setCurrentMetaphor(metaphor);
      const updatedHistory = addToHistory(metaphor);
      setHistory(updatedHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate metaphor');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFavorite = (metaphor: Metaphor): void => {
    const { favorites: newFavorites, history: newHistory } = toggleFavoriteInStorage(metaphor);
    setFavorites(newFavorites);
    setHistory(newHistory);
    
    if (currentMetaphor && currentMetaphor.id === metaphor.id) {
      setCurrentMetaphor({ ...currentMetaphor, isFavorite: !currentMetaphor.isFavorite });
    }
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy text:', err);
      return false;
    }
  };

  const analyzeIdioms = async (text: string): Promise<void> => {
    try {
      const analysis = await analyzePhrase(text);
      setIdiomAnalysis(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze phrase');
    }
  };

  const requestTranslations = async (languages: string[]): Promise<void> => {
    if (!idiomAnalysis) return;

    try {
      const translations = await getTranslations(idiomAnalysis.phrase, languages);
      setIdiomAnalysis(prev => prev ? { ...prev, translations } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get translations');
    }
  };

  const closeIdiomAnalysis = () => {
    setIdiomAnalysis(null);
  };

  const value: MetaphorContextType = {
    input,
    setInput,
    tone,
    setTone,
    currentMetaphor,
    favorites,
    history,
    isGenerating,
    error,
    generateNewMetaphor,
    toggleFavorite,
    copyToClipboard,
    analyzeIdioms,
    idiomAnalysis,
    closeIdiomAnalysis,
    requestTranslations
  };

  return (
    <MetaphorContext.Provider value={value}>
      {children}
      {idiomAnalysis && (
        <IdiomAnalysis 
          analysis={idiomAnalysis} 
          onClose={closeIdiomAnalysis}
          onRequestTranslations={requestTranslations}
        />
      )}
    </MetaphorContext.Provider>
  );
};

export const useMetaphor = (): MetaphorContextType => {
  const context = useContext(MetaphorContext);
  if (context === undefined) {
    throw new Error('useMetaphor must be used within a MetaphorProvider');
  }
  return context;
};