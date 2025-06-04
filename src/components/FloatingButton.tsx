import React, { useState } from 'react';
import { Sparkles, Clipboard, Check, Share2 } from 'lucide-react';
import { useMetaphor } from '../context/MetaphorContext';

const FloatingButton: React.FC = () => {
  const { setInput, generateNewMetaphor, currentMetaphor } = useMetaphor();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleClipboardRead = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text);
        await generateNewMetaphor();
        showToastMessage('Text loaded from clipboard');
      }
    } catch (err) {
      console.error('Clipboard access denied:', err);
      showToastMessage('Please grant clipboard access');
    }
  };

  const handleClipboardWrite = async () => {
    if (currentMetaphor?.text) {
      try {
        await navigator.clipboard.writeText(currentMetaphor.text);
        setShowSuccess(true);
        showToastMessage('Metaphor copied to clipboard');
        setTimeout(() => setShowSuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy metaphor:', err);
        showToastMessage('Failed to copy to clipboard');
      }
    }
  };

  const handleShare = async () => {
    if (!currentMetaphor) return;

    if (navigator.share) {
      try {
        await navigator.share({
          text: currentMetaphor.text,
          title: 'Check out this metaphor!',
          url: window.location.origin
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          handleClipboardWrite();
        }
      }
    } else {
      handleClipboardWrite();
    }
  };

  const showToastMessage = (message: string) => {
    setShowToast(true);
    const toast = document.getElementById('toast-message');
    if (toast) {
      toast.textContent = message;
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <>
      <div className="fixed bottom-20 right-4 flex flex-col gap-2">
        {currentMetaphor && (
          <>
            <button
              onClick={handleShare}
              className="w-12 h-12 bg-green-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-green-600 transition-colors duration-300"
              title="Share metaphor"
            >
              <Share2 className="w-5 h-5" />
            </button>
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
          </>
        )}
        <button
          onClick={handleClipboardRead}
          className="w-12 h-12 bg-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-purple-700 transition-colors duration-300"
          title="Generate metaphor from clipboard"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      </div>

      {/* Toast Notification */}
      <div
        id="toast-message"
        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 ${
          showToast ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
    </>
  );
};

export default FloatingButton;