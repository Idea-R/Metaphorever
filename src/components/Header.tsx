import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full text-center mb-6">
      <div className="flex items-center justify-center">
        <Sparkles className="text-purple-600 w-6 h-6 mr-2" />
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
          Metaphorever
        </h1>
      </div>
      <p className="text-gray-600 mt-2 max-w-md mx-auto">
        Transform your thoughts into beautiful, AI-generated metaphors
      </p>
    </header>
  );
};

export default Header;