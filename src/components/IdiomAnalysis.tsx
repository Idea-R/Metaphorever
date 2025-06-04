import React, { useState } from 'react';
import { BookOpen, Lightbulb, History, Sparkles, Globe2 } from 'lucide-react';
import { IdiomAnalysisResult } from '../types';
import LanguageSelector from './LanguageSelector';

interface IdiomAnalysisProps {
  analysis: IdiomAnalysisResult;
  onClose: () => void;
  onRequestTranslations: (languages: string[]) => void;
}

const IdiomAnalysis: React.FC<IdiomAnalysisProps> = ({ analysis, onClose, onRequestTranslations }) => {
  const [showTranslations, setShowTranslations] = useState(false);

  const handleLanguagesSelected = (languages: string[]) => {
    onRequestTranslations(languages);
    setShowTranslations(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold text-purple-800 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              METASENSE Analysis
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-medium"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-lg text-gray-800 font-medium mb-2 break-words whitespace-pre-wrap">
                "{analysis.phrase || 'No text to analyze'}"
              </div>
              <div className="text-sm text-purple-700 flex items-center">
                <Sparkles className="w-4 h-4 mr-1.5" />
                {analysis.isIdiom ? 'This is an idiom!' : 'This is not an idiom.'}
              </div>
            </div>

            {analysis.meaning && (
              <div className="flex gap-3">
                <Lightbulb className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Meaning</h3>
                  <p className="text-gray-700">{analysis.meaning}</p>
                </div>
              </div>
            )}

            {analysis.origin && (
              <div className="flex gap-3">
                <History className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Origin</h3>
                  <p className="text-gray-700">{analysis.origin}</p>
                </div>
              </div>
            )}

            {analysis.alternatives && analysis.alternatives.length > 0 && (
              <div className="flex gap-3">
                <BookOpen className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Modern Alternatives</h3>
                  <ul className="space-y-2">
                    {analysis.alternatives.map((alt, index) => (
                      <li key={index} className="text-gray-700">• {alt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {analysis.translations && analysis.translations.length > 0 ? (
              <div className="flex gap-3">
                <Globe2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Translations</h3>
                  <div className="space-y-4">
                    {analysis.translations.map((trans, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium text-purple-700 mb-1">
                          {trans.language}
                        </div>
                        <div className="text-gray-800 mb-1">{trans.translation}</div>
                        <div className="text-sm text-gray-600">{trans.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowTranslations(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-300"
              >
                <Globe2 className="w-4 h-4" />
                Get Translations
              </button>
            )}
          </div>
        </div>
      </div>

      {showTranslations && (
        <LanguageSelector
          onClose={() => setShowTranslations(false)}
          onLanguagesSelected={handleLanguagesSelected}
        />
      )}
    </div>
  );
};

export default IdiomAnalysis;