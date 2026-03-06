import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="relative">
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-slate-700"
        />
        <motion.div
          className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <p className="text-sm text-[#1B2A4A] dark:text-slate-100 font-bold">Loading data...</p>
    </div>
  );
};

export default LoadingSpinner;
