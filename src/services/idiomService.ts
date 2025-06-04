import OpenAI from 'openai';
import { IdiomAnalysisResult } from '../types';
import { getCachedAnalysis, setCachedAnalysis } from '../utils/cache';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const analyzePhrase = async (phrase: string): Promise<IdiomAnalysisResult> => {
  // Check cache first
  const cached = getCachedAnalysis(phrase);
  if (cached) {
    return cached;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: `You are METASENSE, an expert in idioms and figurative language. Analyze the given phrase and return a JSON object with these properties:
            - phrase: the analyzed phrase
            - isIdiom: boolean indicating if the phrase contains an idiom
            - meaning: explanation of the idiom's meaning (if applicable)
            - origin: brief history of the idiom (if applicable)
            - alternatives: array of modern alternatives or similar expressions`
        },
        {
          role: "user",
          content: `Analyze this phrase: "${phrase}"`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = {
      ...JSON.parse(response.choices[0].message.content || '{}'),
      phrase // Ensure the phrase is included in the result
    };

    // Cache the result
    setCachedAnalysis(phrase, result);

    return result;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to analyze phrase. Please try again.');
  }
};

export const getTranslations = async (phrase: string, languages: string[]): Promise<IdiomAnalysisResult['translations']> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: `You are a language expert. For the given phrase, provide translations and cultural context for the specified languages. Return a JSON array with objects containing:
            - language: the target language
            - translation: the translated phrase
            - explanation: brief cultural context or notes about the translation`
        },
        {
          role: "user",
          content: `Translate this phrase: "${phrase}" into: ${languages.join(', ')}`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || '[]').translations;
  } catch (error) {
    console.error('Translation API error:', error);
    throw new Error('Failed to translate phrase. Please try again.');
  }
};

export const getMetaphorOfTheDay = async () => {
  const response = await fetch('https://api.quotable.io/random?tags=metaphor');
  if (!response.ok) throw new Error('Failed to fetch metaphor of the day');
  const data = await response.json();
  
  return {
    text: data.content,
    author: data.author,
    date: new Date().toLocaleDateString()
  };
};