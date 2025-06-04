import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  hasRecognitionSupport: boolean;
  error: string | null;
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if browser supports speech recognition
  const hasRecognitionSupport = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  
  // Initialize speech recognition
  const recognition = useCallback(() => {
    if (!hasRecognitionSupport) return null;
    
    // @ts-ignore - TypeScript doesn't have types for webkitSpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    
    return recognitionInstance;
  }, [hasRecognitionSupport]);
  
  const startListening = useCallback(() => {
    if (!hasRecognitionSupport) {
      setError('Your browser does not support speech recognition');
      return;
    }
    
    const recognitionInstance = recognition();
    if (!recognitionInstance) return;
    
    setError(null);
    setIsListening(true);
    
    recognitionInstance.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      
      setTranscript(currentTranscript);
    };
    
    recognitionInstance.onerror = (event: any) => {
      setError(event.error);
      setIsListening(false);
    };
    
    recognitionInstance.onend = () => {
      if (isListening) {
        recognitionInstance.start();
      }
    };
    
    try {
      recognitionInstance.start();
    } catch (err) {
      setError('Error starting speech recognition');
      setIsListening(false);
    }
    
    return recognitionInstance;
  }, [hasRecognitionSupport, isListening, recognition]);
  
  const stopListening = useCallback(() => {
    const recognitionInstance = recognition();
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
    setIsListening(false);
  }, [recognition]);
  
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening, stopListening]);
  
  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    hasRecognitionSupport,
    error
  };
};