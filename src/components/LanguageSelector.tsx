import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface LanguageSelectorProps {
  onClose: () => void;
  onLanguagesSelected: (languages: string[]) => void;
}

const AVAILABLE_LANGUAGES = [
  'Arabic', 'Bengali', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Dutch',
  'English', 'French', 'German', 'Greek', 'Hindi', 'Indonesian', 'Italian',
  'Japanese', 'Korean', 'Persian', 'Polish', 'Portuguese', 'Russian', 'Spanish',
  'Swahili', 'Swedish', 'Thai', 'Turkish', 'Ukrainian', 'Vietnamese'
].sort();

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onClose, onLanguagesSelected }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const filteredLanguages = AVAILABLE_LANGUAGES.filter(lang =>
    lang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const handleSubmit = () => {
    if (selectedLanguages.length > 0) {
      onLanguagesSelected(selectedLanguages);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Select Languages for Translation
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="max-h-60 overflow-y-auto mb-4">
            <div className="grid grid-cols-1 gap-2">
              {filteredLanguages.map(language => (
                <button
                  key={language}
                  onClick={() => toggleLanguage(language)}
                  className={`
                    flex items-center px-4 py-2 rounded-lg transition-colors duration-300
                    ${selectedLanguages.includes(language)
                      ? 'bg-purple-100 text-purple-700'
                      : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  <span className="flex-grow text-left">{language}</span>
                  {selectedLanguages.includes(language) && (
                    <span className="text-purple-600 text-sm">Selected</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedLanguages.length === 0}
              className={`
                px-4 py-2 rounded-lg transition-colors duration-300
                ${selectedLanguages.length === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
                }
              `}
            >
              Translate ({selectedLanguages.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;