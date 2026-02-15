import React, { useState, useRef } from 'react';
import { Link, useLocation } from '../store';
import { useAppStore } from '../store';
import { Download, Upload, Volume2, VolumeX, Moon, Sun, BarChart2 } from 'lucide-react';
import { StatsModal } from './StatsModal';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, setVolume, toggleTheme, exportData, importData } = useAppStore();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showStats, setShowStats] = useState(false);

  const handleDownload = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arcadehub_stats.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (importData(text)) {
          alert('Data imported successfully!');
        } else {
          alert('Invalid data file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🕹️</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ArcadeHub
            </span>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-4">
             <button
              onClick={() => setShowStats(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              title="Statistics"
            >
              <BarChart2 size={20} />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              title="Toggle Theme"
            >
              {settings.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <button
              onClick={() => setVolume(settings.volume === 0 ? 0.5 : 0)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              title="Toggle Sound"
            >
              {settings.volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            {isHome && (
              <>
                <button 
                  onClick={handleDownload}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                  title="Export Data"
                >
                  <Download size={20} />
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                  title="Import Data"
                >
                  <Upload size={20} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".json" 
                  onChange={handleUpload} 
                />
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2024 ArcadeHub. All games run locally in your browser.</p>
        </div>
      </footer>

      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
    </div>
  );
};