import React from 'react';
import { Metaphor } from '../types';
import MetaphorDisplay from './MetaphorDisplay';
import { Clock, Star } from 'lucide-react';

interface MetaphorListProps {
  metaphors: Metaphor[];
  type: 'history' | 'favorites';
  emptyMessage: string;
}

const MetaphorList: React.FC<MetaphorListProps> = ({ 
  metaphors, 
  type, 
  emptyMessage 
}) => {
  if (metaphors.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {type === 'history' ? (
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        ) : (
          <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        )}
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {metaphors.map(metaphor => (
        <MetaphorDisplay key={metaphor.id} metaphor={metaphor} />
      ))}
    </div>
  );
};

export default MetaphorList;