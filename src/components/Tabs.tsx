import React, { useState } from 'react';
import { Clock, Heart } from 'lucide-react';
import { useMetaphor } from '../context/MetaphorContext';
import MetaphorList from './MetaphorList';

type TabType = 'history' | 'favorites';

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('history');
  const { history, favorites } = useMetaphor();
  
  return (
    <div className="mt-8">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`
              py-2 px-4 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'history'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
            onClick={() => setActiveTab('history')}
          >
            <Clock className="w-4 h-4 mr-2" />
            History
          </button>
          <button
            className={`
              py-2 px-4 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'favorites'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart className="w-4 h-4 mr-2" />
            Favorites
          </button>
        </nav>
      </div>
      
      <div className="pt-4">
        {activeTab === 'history' ? (
          <MetaphorList 
            metaphors={history}
            type="history"
            emptyMessage="Your history will appear here"
          />
        ) : (
          <MetaphorList 
            metaphors={favorites}
            type="favorites"
            emptyMessage="Save your favorite metaphors here"
          />
        )}
      </div>
    </div>
  );
};

export default Tabs;