import React from 'react';
import { GAMES_LIST } from '../constants';
import { GameCard } from '../components/GameCard';
import { useAppStore } from '../store';

export const Dashboard: React.FC = () => {
  const { highScores } = useAppStore();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Ready to <span className="text-brand-500">Play?</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Choose from our collection of classic browser games. No downloads, no sign-ups, just pure arcade fun.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {GAMES_LIST.map((game) => (
          <GameCard 
            key={game.id} 
            game={game} 
            highScore={highScores[game.id]} 
          />
        ))}
      </div>
    </div>
  );
};