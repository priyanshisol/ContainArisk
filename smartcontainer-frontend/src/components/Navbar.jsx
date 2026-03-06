import { useState, useEffect } from 'react';
import { Moon, Sun, Bell, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import RiskAlertPanel from './RiskAlertPanel';

const Navbar = ({ darkMode, setDarkMode, onLogout }) => {
  const [showAlerts, setShowAlerts] = useState(false);
  const navigate = useNavigate();
  const officerName = localStorage.getItem('officerName') || 'Officer';

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">SC</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">SmartContainer</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Risk Intelligence Engine</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Welcome, <span className="font-semibold text-gray-900 dark:text-white">{officerName}</span></span>
          
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {showAlerts && <RiskAlertPanel onClose={() => setShowAlerts(false)} />}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
