import { useCallback, useEffect, useRef, useState } from 'react';
import { GameMetrics } from '../types';
import { useAppStore } from '../store';

export const useGameLogic = (gameId: string) => {
  const addSession = useAppStore(s => s.addSession);
  const [currentScore, setCurrentScore] = useState(0);
  const startTime = useRef(Date.now());

  // Reset timer on mount
  useEffect(() => {
    startTime.current = Date.now();
  }, [gameId]);

  const handleScoreUpdate = useCallback((score: number) => {
    setCurrentScore(score);
  }, []);

  const handleGameOver = useCallback((metrics: GameMetrics) => {
    const timeSpent = (Date.now() - startTime.current) / 1000;
    const finalMetrics = {
        ...metrics,
        timeSpentSec: timeSpent
    };
    addSession(gameId, finalMetrics);
  }, [addSession, gameId]);

  return {
    currentScore,
    handleScoreUpdate,
    handleGameOver
  };
};