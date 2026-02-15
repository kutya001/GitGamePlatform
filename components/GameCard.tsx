import React from 'react';
import { Link } from '../store';
import { GameMeta } from '../types';
import { Trophy } from 'lucide-react';

interface Props {
  game: GameMeta;
  highScore?: number;
}

export const GameCard: React.FC<Props> = ({ game, highScore }) => {
  return (
    <Link 
      to={`/game/${game.id}`}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 dark:to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="text-4xl bg-gray-50 dark:bg-gray-700 p-3 rounded-xl shadow-inner">
            {game.icon}
          </div>
          {highScore !== undefined && highScore > 0 && (
            <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-lg text-sm font-medium">
              <Trophy size={14} />
              <span>{highScore}</span>
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {game.title}
        </h3>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm flex-grow">
          {game.description}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
           <span>{game.metricLabel}</span>
           <span className="text-brand-500 group-hover:translate-x-1 transition-transform">Play Now &rarr;</span>
        </div>
      </div>
    </Link>
  );
};