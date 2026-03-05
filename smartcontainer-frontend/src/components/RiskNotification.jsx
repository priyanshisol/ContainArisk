import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const RiskNotification = ({ alert, onClose }) => {
  if (!alert) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: -50, x: '-50%' }}
        className="fixed top-20 left-1/2 transform z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-l-4 border-red-500 p-4 w-96"
      >
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">High Risk Container Detected</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Container ID: {alert.container_id}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Risk Score: {alert.risk_score.toFixed(2)}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RiskNotification;
