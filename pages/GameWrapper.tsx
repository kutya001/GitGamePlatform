import React, { Suspense, useMemo } from 'react';
import { useParams, Link } from '../store';
import { useGameLogic } from '../hooks/useGameLogic';
import { useAppStore } from '../store';
import { GAMES_LIST } from '../constants';
import { ArrowLeft, Loader2 } from 'lucide-react';

// Dynamic Import Mapping
const GAME_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  'tic-tac-toe': React.lazy(() => import('../games/TicTacToe')),
  'snake': React.lazy(() => import('../games/Snake')),
  'minesweeper': React.lazy(() => import('../games/Minesweeper')),
  // Default fallbacks for un-implemented games
  'tetris': React.lazy(() => import('../games/ComingSoon')),
  '2048': React.lazy(() => import('../games/ComingSoon')),
  'flappy': React.lazy(() => import('../games/ComingSoon')),
  'billiards': React.lazy(() => import('../games/ComingSoon')),
  'ping-pong': React.lazy(() => import('../games/ComingSoon')),
  'sudoku': React.lazy(() => import('../games/ComingSoon')),
  'nuts-bolts': React.lazy(() => import('../games/ComingSoon')),
};

export const GameWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const gameMeta = useMemo(() => GAMES_LIST.find(g => g.id === id), [id]);
  const { currentScore, handleScoreUpdate, handleGameOver } = useGameLogic(id || '');
  const { settings } = useAppStore();

  if (!id || !gameMeta) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <h2 className="text-2xl font-bold">Game Not Found</h2>
        <Link to="/" className="mt-4 text-brand-500 hover:underline">Return Home</Link>
      </div>
    );
  }

  const GameComponent = GAME_COMPONENTS[id];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <Link 
          to="/" 
          className="flex items-center text-gray-500 hover:text-brand-500 transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-1" /> Back
        </Link>
        
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>{gameMeta.icon}</span> {gameMeta.title}
          </h1>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg min-w-[100px] text-center">
           <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">
             {gameMeta.metricLabel}
           </div>
           <div className="text-xl font-mono font-bold text-brand-600 dark:text-brand-400">
             {currentScore}
           </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-grow bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative min-h-[500px]">
        <Suspense 
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              <Loader2 className="animate-spin text-brand-500" size={48} />
            </div>
          }
        >
          <GameComponent 
            onScoreUpdate={handleScoreUpdate}
            onGameOver={handleGameOver}
            userSettings={settings}
          />
        </Suspense>
      </div>
    </div>
  );
};