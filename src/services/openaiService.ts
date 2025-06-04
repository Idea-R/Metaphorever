import OpenAI from 'openai';
import { Tone, Metaphor } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
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

  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
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
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate metaphor. Please try again.');
  }
};