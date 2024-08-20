import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import KeyframeEditor from './KeyframeEditor';

const DEFAULT_KEYFRAMES = [
  { time: 0, value: 1 },
  { time: 1, value: 0.95 },
  { time: 2, value: 0.81 },
  { time: 3, value: 0.59 },
  { time: 4, value: 0.31 },
  { time: 5, value: 0 },
  { time: 6, value: -0.31 },
  { time: 7, value: -0.59 },
  { time: 8, value: -0.81 },
  { time: 9, value: -0.95 },
  { time: 10, value: -1 },
  { time: 11, value: -0.95 },
  { time: 12, value: -0.81 },
  { time: 13, value: -0.59 },
  { time: 14, value: -0.31 },
  { time: 15, value: 0 },
  { time: 16, value: 0.31 },
  { time: 17, value: 0.59 },
  { time: 18, value: 0.81 },
  { time: 19, value: 0.95 },
  { time: 20, value: 1 },
  { time: 21, value: 0.95 },
  { time: 22, value: 0.81 },
  { time: 23, value: 0.59 },
  { time: 24, value: 0.31 },
  { time: 25, value: 0 },
  { time: 26, value: -0.31 },
  { time: 27, value: -0.59 },
  { time: 28, value: -0.81 },
  { time: 29, value: -0.95 },
  { time: 30, value: -1 },
  { time: 31, value: -0.95 },
  { time: 32, value: -0.81 },
  { time: 33, value: -0.59 },
  { time: 34, value: -0.31 },
  { time: 35, value: 0 },
  { time: 36, value: 0.31 },
  { time: 37, value: 0.59 },
  { time: 38, value: 0.81 },
  { time: 39, value: 0.95 },
  { time: 40, value: 1 },
  { time: 41, value: 0.95 },
  { time: 42, value: 0.81 },
  { time: 43, value: 0.59 },
  { time: 44, value: 0.31 },
  { time: 45, value: 0 },
  { time: 46, value: -0.31 },
  { time: 47, value: -0.59 },
  { time: 48, value: -0.81 },
  { time: 49, value: -0.95 },
  { time: 50, value: -1 },
  { time: 51, value: -0.95 },
  { time: 52, value: -0.81 },
  { time: 53, value: -0.59 },
  { time: 54, value: -0.31 },
  { time: 55, value: 0 },
  { time: 56, value: 0.31 },
  { time: 57, value: 0.59 },
  { time: 58, value: 0.81 },
  { time: 59, value: 0.95 },
  { time: 60, value: 1 },
  { time: 61, value: 0.95 },
  { time: 62, value: 0.81 },
  { time: 63, value: 0.59 },
  { time: 64, value: 0.31 },
  { time: 65, value: 0 },
  { time: 66, value: -0.31 },
  { time: 67, value: -0.59 },
  { time: 68, value: -0.81 },
  { time: 69, value: -0.95 },
  { time: 70, value: -1 },
  { time: 71, value: -0.95 },
  { time: 72, value: -0.81 },
  { time: 73, value: -0.59 },
  { time: 74, value: -0.31 },
  { time: 75, value: 0 },
  { time: 76, value: 0.31 },
  { time: 77, value: 0.59 },
  { time: 78, value: 0.81 },
  { time: 79, value: 0.95 },
  { time: 80, value: 1 },
  { time: 81, value: 0.95 },
  { time: 82, value: 0.81 },
  { time: 83, value: 0.59 },
  { time: 84, value: 0.31 },
  { time: 85, value: 0 },
  { time: 86, value: -0.31 },
  { time: 87, value: -0.59 },
  { time: 88, value: -0.81 },
  { time: 89, value: -0.95 },
  { time: 90, value: -1 },
  { time: 91, value: -0.95 },
  { time: 92, value: -0.81 },
  { time: 93, value: -0.59 },
  { time: 94, value: -0.31 },
  { time: 95, value: 0 },
  { time: 96, value: 0.31 },
  { time: 97, value: 0.59 },
  { time: 98, value: 0.81 },
  { time: 99, value: 0.95 },
  { time: 100, value: 1 },
  { time: 101, value: 0.95 },
  { time: 102, value: 0.81 },
  { time: 103, value: 0.59 },
  { time: 104, value: 0.31 },
  { time: 105, value: 0 },
  { time: 106, value: -0.31 },
  { time: 107, value: -0.59 },
  { time: 108, value: -0.81 },
  { time: 109, value: -0.95 },
  { time: 110, value: -1 },
  { time: 111, value: -0.95 },
  { time: 112, value: -0.81 },
  { time: 113, value: -0.59 },
  { time: 114, value: -0.31 },
  { time: 115, value: 0 },
  { time: 116, value: 0.31 },
  { time: 117, value: 0.59 },
  { time: 118, value: 0.81 },
  { time: 119, value: 0.95 },
];

const DEFAULT_SETTINGS = {
  randomMin: -1,
  randomMax: 1,
  randomKeyframeCount: 10,
  maxFrameNumber: 100,
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = Cookies.get('darkMode');
    return savedMode === undefined ? true : savedMode === 'true';
  });

  const [keyframes, setKeyframes] = useState(() => {
    const savedKeyframes = localStorage.getItem('keyframes');
    return savedKeyframes ? JSON.parse(savedKeyframes) : DEFAULT_KEYFRAMES;
  });

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('keyframeSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('keyframes', JSON.stringify(keyframes));
  }, [keyframes]);

  useEffect(() => {
    localStorage.setItem('keyframeSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    Cookies.set('darkMode', darkMode.toString(), { expires: 365 });
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
            className={`px-4 py-2 rounded ${darkMode ? 'bg-dracula-red-600 hover:bg-dracula-red-700' : 'bg-dracula-red-500 hover:bg-dracula-red-600'} text-dracula-foreground`}
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
    </div>
  );
}

export default App;