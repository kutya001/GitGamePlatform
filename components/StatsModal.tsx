import React, { useMemo } from 'react';
import { useAppStore } from '../store';
import { GAMES_LIST } from '../constants';
import { X, Trophy, Clock } from 'lucide-react';

export const StatsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { sessions, highScores } = useAppStore();

  const aggregated = useMemo(() => {
    return GAMES_LIST.map(game => {
      const gameSessions = sessions.filter(s => s.gameId === game.id);
      const totalTime = gameSessions.reduce((acc, s) => acc + s.metrics.timeSpentSec, 0);
      const playCount = gameSessions.length;
      const best = highScores[game.id] || 0;
      return { ...game, totalTime, playCount, best };
    }).sort((a, b) => b.playCount - a.playCount);
  }, [sessions, highScores]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Global Statistics</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 space-y-4">
          {aggregated.map((stat) => (
            <div key={stat.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{stat.title}</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.playCount} matches played
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-6 text-right">
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center justify-end gap-1">
                    <Trophy size={12} /> Best
                  </div>
                  <div className="font-mono font-bold text-gray-900 dark:text-white">
                    {stat.best}
                  </div>
                </div>
                <div>
                   <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center justify-end gap-1">
                    <Clock size={12} /> Time
                  </div>
                  <div className="font-mono text-gray-700 dark:text-gray-300">
                    {Math.round(stat.totalTime / 60)}m
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {aggregated.every(s => s.playCount === 0) && (
            <div className="text-center py-10 text-gray-400">
              No games played yet. Start playing to see stats!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};