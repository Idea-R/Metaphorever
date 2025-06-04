import React, { useState } from 'react';
import { Copy, Check, Heart, Share2 } from 'lucide-react';
import { useMetaphor } from '../context/MetaphorContext';
import { Metaphor } from '../types';

interface MetaphorDisplayProps {
  metaphor: Metaphor;
}

const MetaphorDisplay: React.FC<MetaphorDisplayProps> = ({ metaphor }) => {
  const { toggleFavorite, copyToClipboard } = useMetaphor();
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    const success = await copyToClipboard(metaphor.text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this metaphor!',
          text: metaphor.text,
          url: window.location.href
        });
      } catch (error) {
        if (error instanceof DOMException) {
          switch (error.name) {
            case 'AbortError':
              break;
            case 'NotAllowedError':
              console.log('Share permission was denied');
              handleCopy();
              break;
            default:
              console.warn('Share failed:', error.message);
              handleCopy();
          }
        } else {
          console.error('Unexpected error while sharing:', error);
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };
  
  return (
    <div className="relative bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="inline-block px-2 py-1 text-xs font-medium rounded-full text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-900">
          {metaphor.tone.charAt(0).toUpperCase() + metaphor.tone.slice(1)}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleShare}
            className="p-2 rounded-full text-gray-400 dark:text-gray-500 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-colors duration-300"
            title="Share metaphor"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => toggleFavorite(metaphor)}
            className={`
              p-2 rounded-full transition-colors duration-300
              ${metaphor.isFavorite 
                ? 'text-pink-500 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/50 hover:bg-pink-100 dark:hover:bg-pink-900/70' 
                : 'text-gray-400 dark:text-gray-500 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/50'
              }
            `}
            title={metaphor.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${metaphor.isFavorite ? 'fill-pink-500 dark:fill-pink-400' : ''}`} />
          </button>
        </div>
      </div>
      
      <p className="text-gray-800 dark:text-gray-200 text-lg mb-4 leading-relaxed">
        {metaphor.text}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div>
          Based on: <span className="font-medium">{metaphor.originalInput.substring(0, 30)}{metaphor.originalInput.length > 30 ? '...' : ''}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`
            flex items-center px-2 py-1 rounded transition-colors duration-300
            ${copied 
              ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/50' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
            }
          `}
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MetaphorDisplay;