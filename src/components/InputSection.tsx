import React from 'react';
import { useMetaphor } from '../context/MetaphorContext';
import VoiceInput from './VoiceInput';
import { Search } from 'lucide-react';

const InputSection: React.FC = () => {
  const { input, setInput, error, analyzeIdioms } = useMetaphor();
  const maxLength = 280;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setInput(value);
    }
  };

  const handleAnalyze = () => {
    if (input.trim()) {
      analyzeIdioms(input);
    }
  };
  
  const charactersLeft = maxLength - input.length;
  
  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Enter your thoughts
        </label>
        <div className="flex gap-2">
          <button
            onClick={handleAnalyze}
            disabled={!input.trim()}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300
              ${!input.trim() 
                ? 'bg-gray-100 dark:bg-dark-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/70'
              }
            `}
            title="Analyze text with METASENSE"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">Analyze</span>
          </button>
          <VoiceInput />
        </div>
      </div>
      <div className="relative">
        <textarea
          id="input"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter a concept, emotion, or situation..."
          className="w-full p-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-24 transition-all duration-300 bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          rows={4}
        />
        <div className="absolute bottom-2 right-2 text-sm text-gray-500 dark:text-gray-400">
          {charactersLeft} characters left
        </div>
      </div>
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-2 animate-fadeIn">{error}</p>
      )}
    </div>
  );
};

export default InputSection;