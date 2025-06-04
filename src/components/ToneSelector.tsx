import React from 'react';
import { Tone } from '../types';
import { 
  BookOpen, 
  Laugh, 
  Briefcase, 
  Coffee 
} from 'lucide-react';
import { useMetaphor } from '../context/MetaphorContext';

interface ToneSelectorProps {
  className?: string;
}

interface ToneOption {
  value: Tone;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({ className = '' }) => {
  const { tone, setTone } = useMetaphor();

  const toneOptions: ToneOption[] = [
    {
      value: 'poetic',
      label: 'Poetic',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Elegant, thoughtful metaphors with artistic flair'
    },
    {
      value: 'funny',
      label: 'Funny',
      icon: <Laugh className="w-5 h-5" />,
      description: 'Humorous, light-hearted metaphors that bring a smile'
    },
    {
      value: 'professional',
      label: 'Professional',
      icon: <Briefcase className="w-5 h-5" />,
      description: 'Clear, business-appropriate metaphors for formal contexts'
    },
    {
      value: 'casual',
      label: 'Casual',
      icon: <Coffee className="w-5 h-5" />,
      description: 'Relaxed, conversational metaphors for everyday use'
    }
  ];

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Choose a tone
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {toneOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTone(option.value)}
            className={`
              flex flex-col items-center p-3 rounded-lg border transition-all duration-300
              ${tone === option.value 
                ? 'border-purple-500 bg-purple-50 text-purple-700' 
                : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/50'
              }
            `}
            title={option.description}
          >
            <div className={`
              p-2 rounded-full mb-1
              ${tone === option.value ? 'text-purple-600' : 'text-gray-500'}
            `}>
              {option.icon}
            </div>
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToneSelector;