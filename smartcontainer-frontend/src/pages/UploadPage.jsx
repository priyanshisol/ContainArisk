import { useNavigate } from 'react-router-dom';
import UploadCard from '../components/UploadCard';

const UploadPage = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Upload Container Data</h1>
        <p className="text-gray-600 dark:text-gray-400">Upload CSV files containing container shipment information for risk analysis</p>
      </div>

      <UploadCard onUploadSuccess={handleUploadSuccess} />

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">CSV Format Requirements</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Container ID</li>
          <li>• Importer Name</li>
          <li>• Exporter Name</li>
          <li>• Origin Country</li>
          <li>• Destination Country</li>
          <li>• Weight (kg)</li>
          <li>• Declared Value (USD)</li>
          <li>• HS Code</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadPage;
