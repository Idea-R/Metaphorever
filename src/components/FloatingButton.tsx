import React, { useState } from 'react';
import { Sparkles, Clipboard, Check } from 'lucide-react';
import { useMetaphor } from '../context/MetaphorContext';

const FloatingButton: React.FC = () => {
  const { setInput, generateNewMetaphor, currentMetaphor } = useMetaphor();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClipboardRead = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text);
        await generateNewMetaphor();
      }
    } catch (err) {
      console.error('Clipboard access denied:', err);
    }
  };

  const handleClipboardWrite = async () => {
    if (currentMetaphor?.text) {
      try {
        await navigator.clipboard.writeText(currentMetaphor.text);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy metaphor:', err);
      }
    }
  };

  return (
    <div className="fixed bottom-20 right-4 flex flex-col gap-2">
      {currentMetaphor && (
        <button
          onClick={handleClipboardWrite}
          className="w-12 h-12 bg-pink-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-pink-600 transition-colors duration-300"
          title="Copy metaphor to clipboard"
        >
          {showSuccess ? (
            <Check className="w-5 h-5" />
          ) : (
            <Clipboard className="w-5 h-5" />
          )}
        </button>
      )}
      <button
        onClick={handleClipboardRead}
        className="w-12 h-12 bg-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-purple-700 transition-colors duration-300"
        title="Generate metaphor from clipboard"
      >
        <Sparkles className="w-5 h-5" />
      </button>
    </div>
  );
};

export default FloatingButton;