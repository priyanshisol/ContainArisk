import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, delay = 0, clickable = false, link }) => {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  const handleClick = () => {
    if (clickable && link) {
      navigate(link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={handleClick}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 ${
        clickable ? 'cursor-pointer hover:shadow-2xl hover:scale-105 hover:border-blue-500 dark:hover:border-blue-400 transition-all' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{count.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
