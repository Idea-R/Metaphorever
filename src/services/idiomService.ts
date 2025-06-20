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
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are METASENSE, an expert in idioms, figurative language, and global cultural expressions. Analyze the given phrase and return a JSON object with:
            - phrase: the analyzed phrase
            - isIdiom: boolean indicating if the phrase contains an idiom
            - meaning: explanation of the idiom's meaning (if applicable)
            - origin: brief history of the idiom (if applicable)
            - alternatives: array of modern alternatives or similar expressions
            - culturalVariations: array of objects containing:
              * culture: name of the culture/region
              * expression: equivalent expression in that culture
              * literalTranslation: literal English translation (if applicable)
              * context: cultural context and usage notes`
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
      phrase
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
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a master translator and cultural expert. For the given phrase or idiom, provide accurate translations and cultural context for each requested language. For each translation:
          1. Maintain the meaning and spirit of the original
          2. If it's an idiom, provide the closest equivalent idiom in the target language
          3. Include cultural context or usage notes
          4. Ensure the translation is grammatically correct and natural-sounding
          
          Return a JSON object with a 'translations' array containing objects with:
          - language: the target language name
          - translation: the translated text
          - explanation: cultural context and usage notes`
        },
        {
          role: "user",
          content: `Translate this phrase: "${phrase}" into these languages: ${languages.join(', ')}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.translations || [];
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