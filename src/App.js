import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import KeyframeEditor from './KeyframeEditor';
import DarkModeToggle from './DarkModeToggle';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check if there's a saved preference in cookies
    const savedMode = Cookies.get('darkMode');
    return savedMode === undefined ? true : savedMode === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save the preference to a cookie
    Cookies.set('darkMode', darkMode.toString(), { expires: 365 }); // Cookie expires in 1 year
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-dracula-background' : 'bg-dracula-foreground'}`}>
      <header className={`${darkMode ? 'bg-dracula-background-800' : 'bg-dracula-foreground-100'} shadow`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-dracula-foreground' : 'text-dracula-background-900'}`}>
            KeyCrafter
          </h1>
          {/* <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> */}
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex flex-col">
          <KeyframeEditor darkMode={darkMode} />
        </div>
      </main>
    </div>
  );
}

export default App;