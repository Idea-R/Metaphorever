import React from 'react';
import { useMetaphor } from '../context/MetaphorContext';
import MetaphorDisplay from './MetaphorDisplay';
import { Sparkles } from 'lucide-react';

const CurrentMetaphor: React.FC = () => {
  const { currentMetaphor, isGenerating } = useMetaphor();
  
  if (isGenerating) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center min-h-32 bg-gray-50 animate-pulse">
        <Sparkles className="w-8 h-8 mb-3 text-purple-400" />
        <p className="text-gray-500">Creating your metaphor...</p>
      </div>
    );
  }
  
  if (!currentMetaphor) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center min-h-32 bg-gray-50">
        <Sparkles className="w-8 h-8 mb-3 text-gray-300" />
        <p className="text-gray-500">Your metaphor will appear here</p>
      </div>
    );
  }
  
  return <MetaphorDisplay metaphor={currentMetaphor} />;
};

export default CurrentMetaphor;