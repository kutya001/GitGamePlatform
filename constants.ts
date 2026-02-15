import { GameMeta } from './types';

export const GAMES_LIST: GameMeta[] = [
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    description: 'Classic 3x3 strategy game. Play against a basic AI.',
    icon: '⭕',
    metricLabel: 'Win'
  },
  {
    id: 'snake',
    title: 'Snake',
    description: 'Eat apples, grow longer, don\'t hit the walls.',
    icon: '🐍',
    metricLabel: 'Score'
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    description: 'Clear the board without detonating any mines.',
    icon: '💣',
    metricLabel: 'Time (s)'
  },
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'Stack shapes and clear lines.',
    icon: '🧱',
    metricLabel: 'Score'
  },
  {
    id: '2048',
    title: '2048',
    description: 'Join the numbers and get to the 2048 tile.',
    icon: '🔢',
    metricLabel: 'Score'
  },
  {
    id: 'flappy',
    title: 'Flappy Ball',
    description: 'Tap to fly through pipes.',
    icon: '🐦',
    metricLabel: 'Pipes'
  },
  {
    id: 'billiards',
    title: 'Billiards',
    description: '8-Ball pool physics simulation.',
    icon: '🎱',
    metricLabel: 'Score'
  },
  {
    id: 'ping-pong',
    title: 'Ping Pong',
    description: 'Classic arcade table tennis.',
    icon: '🏓',
    metricLabel: 'Score'
  },
  {
    id: 'sudoku',
    title: 'Sudoku',
    description: 'Fill the grid so every row, column and box has digits 1-9.',
    icon: '🧩',
    metricLabel: 'Time'
  },
  {
    id: 'nuts-bolts',
    title: 'Nuts & Bolts',
    description: 'Sort the colored nuts onto matching bolts.',
    icon: '🔩',
    metricLabel: 'Level'
  }
];