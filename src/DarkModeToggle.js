import React from 'react';

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-lg ${
        darkMode ? 'bg-yellow-900 text-gray-900' : 'bg-gray-700 text-yellow-400'
      }`}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default DarkModeToggle;