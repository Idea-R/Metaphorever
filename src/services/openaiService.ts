import OpenAI from 'openai';
import { Tone, Metaphor } from '../types';

const validateApiKey = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please add your API key to the .env file.');
  }
  if (!apiKey.startsWith('sk-')) {
    throw new Error('Invalid OpenAI API key format. API keys should start with "sk-"');
  }
  return apiKey;
};

// Validate API key before creating the client
const apiKey = validateApiKey();

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Only for hackathon demo
});

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const tonePrompts = {
  poetic: "Create a beautiful, lyrical metaphor comparing this to something in nature or art",
  funny: "Create a hilarious, unexpected metaphor that makes people laugh",
  professional: "Create a sophisticated business or technical metaphor",
  casual: "Create a relatable, everyday metaphor using common objects or experiences"
};

export const generateMetaphor = async (input: string, tone: Tone): Promise<Metaphor> => {
  if (!input.trim()) {
    throw new Error('Please enter some text to generate a metaphor');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a creative metaphor generator. Create vivid, original metaphors. 
          IMPORTANT: Output ONLY the metaphor itself, no explanations. 
          ${tonePrompts[tone]}. 
          Format: "[Subject] is [metaphor]" or use other metaphorical structures.`
        },
        {
          role: "user",
          content: `Create a ${tone} metaphor for: "${input}"`
        }
      ],
      temperature: 0.9,
      max_tokens: 100
    });

    const metaphorText = response.choices[0].message.content || '';

    return {
      id: generateId(),
      text: metaphorText,
      originalInput: input,
      tone,
      timestamp: Date.now(),
      isFavorite: false
    };
  } catch (error) {
    if (error instanceof Error) {
      // Check for specific API key related errors
      if (error.message.includes('API key')) {
        throw new Error('Invalid OpenAI API key. Please check your API key in the .env file.');
      }
    }
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate metaphor. Please try again.');
  }
};