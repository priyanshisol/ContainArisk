import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

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

  const gradientMap = {
    'bg-blue-500': 'from-emerald-500 to-cyan-500',
    'bg-red-500': 'from-red-500 to-rose-500',
    'bg-green-500': 'from-emerald-400 to-green-500',
    'bg-orange-500': 'from-amber-500 to-orange-500',
  };

  const shadowMap = {
    'bg-blue-500': 'shadow-emerald-500/20',
    'bg-red-500': 'shadow-red-500/20',
    'bg-green-500': 'shadow-emerald-500/20',
    'bg-orange-500': 'shadow-amber-500/20',
  };

  const gradient = gradientMap[color] || 'from-emerald-500 to-cyan-500';
  const shadow = shadowMap[color] || 'shadow-emerald-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={clickable ? { y: -4, transition: { duration: 0.2 } } : undefined}
      onClick={handleClick}
      className={`card-premium relative p-6 overflow-hidden group ${clickable ? 'cursor-pointer' : ''
        }`}
    >
      {/* Subtle gradient glow on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-[#1B2A4A] dark:text-slate-100 tracking-tight">{count.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-md ${shadow}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      {clickable && (
        <div className="mt-4 flex items-center text-xs font-medium text-gray-600 group-hover:text-emerald-400 transition-colors">
          <span>View details</span>
          <ArrowUpRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
