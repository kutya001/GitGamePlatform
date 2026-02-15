import React, { useRef, useEffect, useState } from 'react';
import { GameProps } from '../types';

const GRID_SIZE = 20;
const TILE_COUNT = 20; // 400x400 canvas

const Snake: React.FC<GameProps> = ({ onScoreUpdate, onGameOver, userSettings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  // Game State Refs (to avoid closure staleness in loop)
  const snakeRef = useRef<{x:number, y:number}[]>([{x: 10, y: 10}]);
  const foodRef = useRef<{x:number, y:number}>({x: 15, y: 15});
  const velRef = useRef<{x:number, y:number}>({x: 0, y: 0});
  const scoreRef = useRef(0);
  const gameLoopRef = useRef<number | null>(null);

  // Reset logic
  const startGame = () => {
    snakeRef.current = [{x: 10, y: 10}];
    velRef.current = {x: 1, y: 0}; // Start moving right
    placeFood();
    scoreRef.current = 0;
    setScore(0);
    onScoreUpdate(0);
    setIsPlaying(true);
  };

  const placeFood = () => {
    foodRef.current = {
      x: Math.floor(Math.random() * TILE_COUNT),
      y: Math.floor(Math.random() * TILE_COUNT)
    };
  };

  const gameOver = () => {
    setIsPlaying(false);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    onGameOver({
      score: scoreRef.current,
      won: false,
      timeSpentSec: 0 // handled by wrapper
    });
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      switch(e.key) {
        case 'ArrowLeft': if (velRef.current.x !== 1) velRef.current = {x: -1, y: 0}; break;
        case 'ArrowRight': if (velRef.current.x !== -1) velRef.current = {x: 1, y: 0}; break;
        case 'ArrowUp': if (velRef.current.y !== 1) velRef.current = {x: 0, y: -1}; break;
        case 'ArrowDown': if (velRef.current.y !== -1) velRef.current = {x: 0, y: 1}; break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      const ctx = canvasRef.current?.getContext('2d');
      gameLoopRef.current = window.setInterval(() => {
        if (!ctx) return;
        update();
        draw(ctx);
      }, 100); // Game Speed
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const update = () => {
    const head = { 
      x: snakeRef.current[0].x + velRef.current.x, 
      y: snakeRef.current[0].y + velRef.current.y 
    };

    // Wall Collision
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
      gameOver();
      return;
    }

    // Self Collision
    for (let part of snakeRef.current) {
      if (part.x === head.x && part.y === head.y) {
        gameOver();
        return;
      }
    }

    snakeRef.current.unshift(head);

    // Food Collision
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      scoreRef.current += 10;
      setScore(scoreRef.current);
      onScoreUpdate(scoreRef.current);
      placeFood();
      // Sound effect could go here using userSettings.volume
    } else {
      snakeRef.current.pop();
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    // Clear
    ctx.fillStyle = userSettings.theme === 'dark' ? '#1f2937' : '#f0fdf4';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Food
    ctx.fillStyle = '#ef4444'; // Red-500
    ctx.beginPath();
    ctx.arc(
      foodRef.current.x * GRID_SIZE + GRID_SIZE/2, 
      foodRef.current.y * GRID_SIZE + GRID_SIZE/2, 
      GRID_SIZE/2 - 2, 0, Math.PI*2
    );
    ctx.fill();

    // Snake
    ctx.fillStyle = '#22c55e'; // Green-500
    for (let part of snakeRef.current) {
      ctx.fillRect(
        part.x * GRID_SIZE + 1, 
        part.y * GRID_SIZE + 1, 
        GRID_SIZE - 2, 
        GRID_SIZE - 2
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="relative rounded-lg overflow-hidden shadow-2xl border-4 border-gray-300 dark:border-gray-600">
        <canvas 
          ref={canvasRef}
          width={400} 
          height={400}
          className="bg-green-50 dark:bg-gray-800 block"
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white text-xl font-bold rounded-full shadow-lg transition-transform hover:scale-110"
            >
              {score > 0 ? 'Play Again' : 'Start Game'}
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-500 text-sm">Use Arrow Keys to Move</p>
    </div>
  );
};

export default Snake;