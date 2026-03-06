import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import UploadCard from '../components/UploadCard';

const UploadPage = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    navigate('/dashboard');
  };

  const fields = ['Container ID', 'Importer Name', 'Exporter Name', 'Origin Country', 'Destination Country', 'Weight (kg)', 'Declared Value (USD)', 'HS Code'];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-slate-100 tracking-tight">Upload Container Data</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload CSV files containing container shipment information for risk analysis</p>
      </motion.div>

      <UploadCard onUploadSuccess={handleUploadSuccess} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-blue-50 rounded-2xl p-6 border border-blue-100"
      >
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-[#1B2A4A] dark:text-slate-100">CSV Format Requirements</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {fields.map((field) => (
            <div key={field} className="flex items-center space-x-2 text-sm text-[#1B2A4A] dark:text-slate-100 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <span>{field}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default UploadPage;
