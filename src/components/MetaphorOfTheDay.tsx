import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { MetaphorOfTheDay as MetaphorOfTheDayType } from '../types';
import { getMetaphorOfTheDay } from '../services/idiomService';

const MetaphorOfTheDay: React.FC = () => {
  const [metaphor, setMetaphor] = useState<MetaphorOfTheDayType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetaphor = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMetaphorOfTheDay();
      setMetaphor(data);
    } catch (err) {
      setError('Failed to fetch metaphor of the day');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetaphor();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-6 animate-pulse">
        <div className="flex items-center justify-center h-20">
          <Sparkles className="w-6 h-6 text-purple-400" />
        </div>
      </div>
    );
  }

  if (error || !metaphor) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
          <h2 className="text-sm font-medium text-purple-800">Metaphor of the Day</h2>
        </div>
        <button
          onClick={fetchMetaphor}
          className="p-1 hover:bg-purple-200 rounded-full transition-colors duration-300"
          title="Get new metaphor"
        >
          <RefreshCw className="w-4 h-4 text-purple-600" />
        </button>
      </div>
      <p className="text-gray-800 text-lg mb-2">{metaphor.text}</p>
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>— {metaphor.author}</span>
        <span>{metaphor.date}</span>
      </div>
    </div>
  );
};

export default MetaphorOfTheDay;