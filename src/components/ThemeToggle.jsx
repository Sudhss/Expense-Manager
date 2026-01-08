import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-700 hover:text-primary transition-colors" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-300 hover:text-yellow-200 transition-colors" />
      )}
    </button>
  );
};

export default ThemeToggle;
