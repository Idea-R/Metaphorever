import React, { useEffect } from 'react';
import { useMetaphor } from '../context/MetaphorContext';

const ShareHandler: React.FC = () => {
  const { setInput, generateNewMetaphor } = useMetaphor();

  useEffect(() => {
    const handleSharedData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const sharedText = params.get('text');
        
        if (sharedText) {
          setInput(sharedText);
          await generateNewMetaphor();
          // Clear the URL params after processing
          window.history.replaceState({}, '', '/');
        }
      } catch (error) {
        console.error('Error processing shared text:', error);
      }
    };

    handleSharedData();
  }, [setInput, generateNewMetaphor]);

  return null;
};

export default ShareHandler;