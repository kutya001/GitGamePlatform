import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from '../types';
import { RotateCcw } from 'lucide-react';

type Player = 'X' | 'O';
type Board = (Player | null)[];

const TicTacToe: React.FC<GameProps> = ({ onScoreUpdate, onGameOver, userSettings }) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Player is X
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);

  const checkWinner = (squares: Board): Player | 'Draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a] as Player;
      }
    }
    if (!squares.includes(null)) return 'Draw';
    return null;
  };

  // AI Logic (Simple)
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        const available = board.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
        if (available.length > 0) {
          // Try to win or block
          let move = available[Math.floor(Math.random() * available.length)];
          
          // Basic heuristic: check if can win
          for(let m of available) {
             const copy = [...board];
             copy[m] = 'O';
             if (checkWinner(copy) === 'O') { move = m; break; }
          }

          const newBoard = [...board];
          newBoard[move] = 'O';
          setBoard(newBoard);
          setIsPlayerTurn(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner, board]);

  // Check game state after board updates
  useEffect(() => {
    const res = checkWinner(board);
    if (res) {
      setWinner(res);
      if (res === 'X') {
        onScoreUpdate(1); // 1 point for win
        onGameOver({ score: 1, won: true, timeSpentSec: 0 });
      } else if (res === 'O' || res === 'Draw') {
        onGameOver({ score: 0, won: false, timeSpentSec: 0 });
      }
    }
  }, [board, onScoreUpdate, onGameOver]);

  const handleClick = (i: number) => {
    if (board[i] || winner || !isPlayerTurn) return;
    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
    onScoreUpdate(0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-3xl font-bold mb-8 dark:text-white">
        {winner ? (winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`) : `Turn: ${isPlayerTurn ? 'You (X)' : 'AI (O)'}`}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={!!cell || !!winner || !isPlayerTurn}
            className={`
              w-24 h-24 sm:w-32 sm:h-32 rounded-xl text-5xl font-bold flex items-center justify-center shadow-lg transition-all
              ${cell === 'X' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}
              ${cell === 'O' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : ''}
              ${!cell ? 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' : ''}
            `}
          >
            {cell}
          </button>
        ))}
      </div>

      {winner && (
        <button
          onClick={resetGame}
          className="flex items-center space-x-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105"
        >
          <RotateCcw size={20} />
          <span>Play Again</span>
        </button>
      )}
    </div>
  );
};

export default TicTacToe;