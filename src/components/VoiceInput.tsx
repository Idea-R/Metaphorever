import React, { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useMetaphor } from '../context/MetaphorContext';

const VoiceInput: React.FC = () => {
  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening, 
    resetTranscript,
    hasRecognitionSupport,
    error: speechError 
  } = useSpeechRecognition();
  
  const { setInput, generateNewMetaphor } = useMetaphor();
  const [showPreview, setShowPreview] = useState(false);
  
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      setShowPreview(true);
    }
  }, [transcript, setInput]);
  
  useEffect(() => {
    let timer: number;
    if (!isListening && transcript) {
      timer = window.setTimeout(() => {
        generateNewMetaphor();
        setShowPreview(false);
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [isListening, transcript, generateNewMetaphor]);
  
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setShowPreview(false);
      startListening();
    }
  };
  
  if (!hasRecognitionSupport) {
    return (
      <button 
        className="text-gray-400 cursor-not-allowed flex items-center text-sm"
        disabled
        title="Speech recognition not supported in this browser"
      >
        <MicOff className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Not supported</span>
      </button>
    );
  }
  
  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={toggleListening}
        className={`
          flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300
          ${isListening 
            ? 'bg-pink-500 text-white animate-pulse shadow-lg'
            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
          }
        `}
        title={isListening ? 'Stop recording' : 'Start voice input'}
      >
        {isListening ? (
          <>
            <Mic className="w-5 h-5 mr-2" />
            Recording...
          </>
        ) : (
          <>
            <Mic className="w-5 h-5 mr-2" />
            Voice Input
          </>
        )}
      </button>
      
      {showPreview && transcript && (
        <div className="text-sm text-gray-600 italic animate-fadeIn">
          "{transcript}"
        </div>
      )}
    </div>
  );
};

export default VoiceInput;