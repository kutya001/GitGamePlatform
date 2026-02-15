import React, { useState, useEffect } from 'react';
import { GameProps } from '../types';
import { Flag, Bomb, RotateCcw } from 'lucide-react';

interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  isOpen: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

const ROWS = 10;
const COLS = 10;
const MINES = 15;

const Minesweeper: React.FC<GameProps> = ({ onScoreUpdate, onGameOver }) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [status, setStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [flags, setFlags] = useState(MINES);

  useEffect(() => {
    initBoard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initBoard = () => {
    const newGrid: Cell[][] = [];
    for (let y = 0; y < ROWS; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < COLS; x++) {
        row.push({ x, y, isMine: false, isOpen: false, isFlagged: false, neighborCount: 0 });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setStatus('idle');
    setFlags(MINES);
    onScoreUpdate(0);
  };

  const placeMines = (firstX: number, firstY: number) => {
    const newGrid = [...grid.map(row => row.map(cell => ({ ...cell })))];
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const rx = Math.floor(Math.random() * COLS);
      const ry = Math.floor(Math.random() * ROWS);
      // Ensure not on first click and not already mine
      if (!newGrid[ry][rx].isMine && (Math.abs(rx - firstX) > 1 || Math.abs(ry - firstY) > 1)) {
        newGrid[ry][rx].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (newGrid[y][x].isMine) continue;
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy, nx = x + dx;
            if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && newGrid[ny][nx].isMine) {
              count++;
            }
          }
        }
        newGrid[y][x].neighborCount = count;
      }
    }
    return newGrid;
  };

  const reveal = (x: number, y: number, currentGrid: Cell[][]) => {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS || currentGrid[y][x].isOpen || currentGrid[y][x].isFlagged) return;
    
    currentGrid[y][x].isOpen = true;
    
    if (currentGrid[y][x].neighborCount === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          reveal(x + dx, y + dy, currentGrid);
        }
      }
    }
  };

  const handleCellClick = (x: number, y: number) => {
    if (status === 'won' || status === 'lost') return;

    let newGrid = [...grid];

    if (status === 'idle') {
      newGrid = placeMines(x, y);
      setStatus('playing');
    }

    if (newGrid[y][x].isFlagged) return;

    if (newGrid[y][x].isMine) {
      newGrid[y][x].isOpen = true;
      setGrid(newGrid);
      setStatus('lost');
      onGameOver({ score: 0, won: false, timeSpentSec: 0 }); // Time handled by wrapper
      return;
    }

    reveal(x, y, newGrid);
    setGrid(newGrid);

    // Check Win
    let closedNonMines = 0;
    newGrid.forEach(row => row.forEach(cell => {
      if (!cell.isMine && !cell.isOpen) closedNonMines++;
    }));

    if (closedNonMines === 0) {
      setStatus('won');
      onGameOver({ score: MINES * 10, won: true, timeSpentSec: 0 });
    }
  };

  const handleRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (status !== 'playing' && status !== 'idle') return;
    const newGrid = [...grid];
    const cell = newGrid[y][x];
    if (cell.isOpen) return;

    cell.isFlagged = !cell.isFlagged;
    setGrid(newGrid);
    setFlags(prev => cell.isFlagged ? prev - 1 : prev + 1);
  };

  const getCellColor = (count: number) => {
    const colors = ['text-gray-400', 'text-blue-500', 'text-green-500', 'text-red-500', 'text-purple-600', 'text-red-800', 'text-teal-600', 'text-black', 'text-gray-600'];
    return colors[count];
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex justify-between w-full max-w-[350px] mb-4 text-xl font-bold dark:text-white">
         <div className="flex items-center gap-2">
            <Flag className="text-red-500" /> {flags}
         </div>
         <div className="uppercase">
            {status === 'won' ? <span className="text-green-500">You Won!</span> : 
             status === 'lost' ? <span className="text-red-500">Boom!</span> : 
             <span>Minesweeper</span>}
         </div>
      </div>

      <div 
        className="grid gap-1 bg-gray-300 dark:bg-gray-700 p-2 rounded-lg select-none"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {grid.map((row, y) => row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            onClick={() => handleCellClick(x, y)}
            onContextMenu={(e) => handleRightClick(e, x, y)}
            className={`
              w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-sm cursor-pointer rounded-sm transition-all
              ${cell.isOpen 
                  ? 'bg-gray-100 dark:bg-gray-800' 
                  : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 shadow-inner'
              }
              ${cell.isMine && cell.isOpen ? 'bg-red-500' : ''}
            `}
          >
            {cell.isOpen && !cell.isMine && cell.neighborCount > 0 && (
              <span className={getCellColor(cell.neighborCount)}>{cell.neighborCount}</span>
            )}
            {cell.isOpen && cell.isMine && <Bomb size={16} className="text-white" />}
            {!cell.isOpen && cell.isFlagged && <Flag size={16} className="text-red-600" />}
          </div>
        )))}
      </div>

      {(status === 'won' || status === 'lost') && (
        <button
          onClick={initBoard}
          className="mt-8 flex items-center space-x-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-bold shadow-lg"
        >
          <RotateCcw size={20} />
          <span>Restart</span>
        </button>
      )}
    </div>
  );
};

export default Minesweeper;