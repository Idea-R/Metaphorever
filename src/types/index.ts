export type Tone = 'poetic' | 'funny' | 'professional' | 'casual';

export interface Metaphor {
  id: string;
  text: string;
  originalInput: string;
  tone: Tone;
  timestamp: number;
  isFavorite: boolean;
}

export interface MetaphorOfTheDay {
  text: string;
  author: string;
  date: string;
}

export interface IdiomAnalysisResult {
  phrase: string;
  isIdiom: boolean;
  meaning?: string;
  origin?: string;
  alternatives?: string[];
  translations?: {
    language: string;
    translation: string;
    explanation: string;
  }[];
}