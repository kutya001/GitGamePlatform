export interface GameMetrics {
  score: number;
  won: boolean;
  timeSpentSec: number;
  customData?: Record<string, any>;
}

export interface GameProps {
  onScoreUpdate: (currentScore: number) => void;
  onGameOver: (metrics: GameMetrics) => void;
  userSettings: { soundVolume: number; theme: 'light' | 'dark' };
}

export interface GameMeta {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or URL
  metricLabel: string; // e.g., "Score", "Time", "Moves"
}

export interface GameSession {
  id: string;
  gameId: string;
  timestamp: number;
  metrics: GameMetrics;
}

export interface AppState {
  sessions: GameSession[];
  highScores: Record<string, number>;
  settings: {
    volume: number; // 0 to 1
    theme: 'light' | 'dark';
  };
  addSession: (gameId: string, metrics: GameMetrics) => void;
  setVolume: (volume: number) => void;
  toggleTheme: () => void;
  importData: (data: string) => boolean;
  exportData: () => string;
}
