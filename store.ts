import React, { createContext, useContext, useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, GameSession } from './types';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      sessions: [],
      highScores: {},
      settings: {
        volume: 0.5,
        theme: 'light',
      },

      addSession: (gameId, metrics) => {
        const newSession: GameSession = {
          id: crypto.randomUUID(),
          gameId,
          timestamp: Date.now(),
          metrics,
        };

        set((state) => {
          const currentHigh = state.highScores[gameId] || 0;
          const isNewHigh = metrics.score > currentHigh;
          
          return {
            sessions: [newSession, ...state.sessions],
            highScores: isNewHigh 
              ? { ...state.highScores, [gameId]: metrics.score }
              : state.highScores
          };
        });
      },

      setVolume: (volume) => set((state) => ({ 
        settings: { ...state.settings, volume } 
      })),

      toggleTheme: () => set((state) => {
        const newTheme = state.settings.theme === 'light' ? 'dark' : 'light';
        if (typeof document !== 'undefined') {
          if (newTheme === 'dark') document.documentElement.classList.add('dark');
          else document.documentElement.classList.remove('dark');
        }
        return { settings: { ...state.settings, theme: newTheme } };
      }),

      exportData: () => {
        const { sessions, highScores, settings } = get();
        return JSON.stringify({ sessions, highScores, settings });
      },

      importData: (jsonStr: string) => {
        try {
          const data = JSON.parse(jsonStr);
          if (data.sessions && data.highScores && data.settings) {
            set({ 
              sessions: data.sessions, 
              highScores: data.highScores, 
              settings: data.settings 
            });
            // Apply theme immediately
            if (data.settings.theme === 'dark') document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
            return true;
          }
          return false;
        } catch (e) {
          console.error("Import failed", e);
          return false;
        }
      },
    }),
    {
      name: 'app_platform_state',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
         // Sync theme with DOM on load
         if (state && state.settings.theme === 'dark') {
             document.documentElement.classList.add('dark');
         }
      }
    }
  )
);

// --- Custom Router Implementation (Replacing react-router-dom) ---

const LocationContext = createContext<{ pathname: string }>({ pathname: '/' });
const ParamsContext = createContext<Record<string, string>>({});

export const useLocation = () => useContext(LocationContext);
export const useParams = <T extends Record<string, string | undefined> = Record<string, string>>() => useContext(ParamsContext) as T;

export const HashRouter = ({ children }: { children: React.ReactNode }) => {
  const [pathname, setPathname] = useState(window.location.hash.slice(1).replace(/^#/, '') || '/');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1).replace(/^#/, '');
      setPathname(hash || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash) window.location.hash = '#/';
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return React.createElement(LocationContext.Provider, { value: { pathname } }, children);
};

export const Link = ({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) => {
  return React.createElement('a', { href: `#${to}`, className }, children);
};

export const Navigate = ({ to }: { to: string; replace?: boolean }) => {
  useEffect(() => {
    window.location.hash = `#${to}`;
  }, [to]);
  return null;
};

export const Routes = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  
  let match = null;
  let params = {};
  let element = null;

  React.Children.forEach(children, (child) => {
    if (match) return;
    if (!React.isValidElement(child)) return;
    
    // @ts-ignore
    const { path, element: el } = child.props;
    
    if (path === '*') {
      if (!match) { match = path; element = el; }
      return;
    }

    if (path && path.includes(':')) {
        const pathParts = path.split('/');
        const currentParts = pathname.split('/');
        if (pathParts.length === currentParts.length) {
            let isMatch = true;
            const currentParams: Record<string, string> = {};
            for (let i = 0; i < pathParts.length; i++) {
                if (pathParts[i].startsWith(':')) {
                    currentParams[pathParts[i].slice(1)] = currentParts[i];
                } else if (pathParts[i] !== currentParts[i]) {
                    isMatch = false;
                    break;
                }
            }
            if (isMatch) {
                match = path;
                params = currentParams;
                element = el;
            }
        }
    } else {
        if (path === pathname) {
            match = path;
            element = el;
        }
    }
  });

  return React.createElement(ParamsContext.Provider, { value: params }, element);
};

export const Route = (props: { path: string; element: React.ReactNode }) => null;