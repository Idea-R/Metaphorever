import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useMetaphor } from '../context/MetaphorContext';

const GenerateButton: React.FC = () => {
  const { generateNewMetaphor, isGenerating, input } = useMetaphor();
  
  const handleGenerate = () => {
    if (!isGenerating) {
      generateNewMetaphor();
    }
  };
  
  const isDisabled = isGenerating || !input.trim();
  
  return (
    <button
      onClick={handleGenerate}
      disabled={isDisabled}
      className={`
        w-full py-3 px-4 flex items-center justify-center rounded-lg font-medium transition-all duration-300
        ${isDisabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 shadow-md hover:shadow-lg'
        }
      `}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 mr-2" />
          Generate Metaphor
        </>
      )}
    </button>
  );
};

export default GenerateButton;