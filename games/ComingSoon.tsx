import React from 'react';
import { GameProps } from '../types';
import { Construction } from 'lucide-react';

const ComingSoon: React.FC<GameProps> = ({ onGameOver }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
      <Construction className="text-brand-500 mb-4" size={64} />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Work in Progress
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        This game is currently under development by our engineering team. 
        Please check back later for updates!
      </p>
      <button 
        onClick={() => onGameOver({ score: 0, won: false, timeSpentSec: 0 })}
        className="mt-6 px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
      >
        Exit
      </button>
    </div>
  );
};

export default ComingSoon;