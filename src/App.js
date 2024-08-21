import React, { useState, useEffect } from 'react';
import KeyframeEditor from './KeyframeEditor';
import { DEFAULT_KEYFRAMES, DEFAULT_SETTINGS } from './config';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const [keyframes, setKeyframes] = useState(() => {
    try {
      const savedKeyframes = localStorage.getItem('keyframes');
      return savedKeyframes ? JSON.parse(savedKeyframes) : DEFAULT_KEYFRAMES;
    } catch (error) {
      console.error('Error loading keyframes from localStorage:', error);
      return DEFAULT_KEYFRAMES;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('keyframeSettings');
      return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('keyframes', JSON.stringify(keyframes));
    } catch (error) {
      console.error('Error saving keyframes to localStorage:', error);
    }
  }, [keyframes]);

  useEffect(() => {
    try {
      localStorage.setItem('keyframeSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }, [settings]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const resetAllSettings = () => {
    setKeyframes(DEFAULT_KEYFRAMES);
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-dracula-background' : 'bg-dracula-foreground'}`}>
      <header className={`${darkMode ? 'bg-dracula-background-800' : 'bg-dracula-foreground-100'} shadow`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-dracula-foreground' : 'text-dracula-background-900'}`}>
            KeyCrafter
          </h1>
          <button
            onClick={resetAllSettings}
            className={`px-4 py-2 rounded ${darkMode ? 'bg-dracula-red-800 hover:bg-dracula-red-700' : 'bg-dracula-red-500 hover:bg-dracula-red-600'} text-dracula-foreground`}
          >
            Reset All
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex flex-col">
          <KeyframeEditor 
            darkMode={darkMode} 
            keyframes={keyframes} 
            setKeyframes={setKeyframes}
            settings={settings}
            setSettings={setSettings}
          />
        </div>
      </main>
      <footer className={`fixed bottom-0 left-0 right-0 py-2 text-center text-sm ${darkMode ? 'bg-dracula-background-800 text-dracula-foreground-300' : 'bg-dracula-foreground-100 text-dracula-background-600'}`}>
        <p>
            view source on <a href="https://github.com/null-hax/keycrafter" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
          {' | '}
          made by <a href="https://twitter.com/null_hax" target="_blank" rel="noopener noreferrer" className="hover:underline">@null_hax</a>
        </p>
      </footer>
    </div>
  );
}

export default App;