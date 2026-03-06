import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, DollarSign, Weight } from 'lucide-react';
import { motion } from 'framer-motion';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { getContainerDetails } from '../services/api';

const ContainerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [container, setContainer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const data = await getContainerDetails(id);
      setContainer(data);
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  const riskPercentage = (container.risk_score * 100).toFixed(0);

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Container Details</h1>
        <p className="text-gray-600 dark:text-gray-400">{container.container_id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipment Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Importer</p>
              <p className="font-semibold text-gray-900 dark:text-white">{container.importer}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Exporter</p>
              <p className="font-semibold text-gray-900 dark:text-white">{container.exporter}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Origin</p>
              <p className="font-semibold text-gray-900 dark:text-white">{container.origin}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Destination</p>
              <p className="font-semibold text-gray-900 dark:text-white">{container.destination}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weight</p>
              <p className="font-semibold text-gray-900 dark:text-white">{container.weight.toLocaleString()} kg</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Declared Value</p>
              <p className="font-semibold text-gray-900 dark:text-white">${container.declared_value.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg col-span-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">HS Code</p>
              <p className="font-semibold text-gray-900 dark:text-white">{container.hs_code}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Assessment</h3>
          
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="transform -rotate-90 w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - container.risk_score)}`}
                  className={`${
                    container.risk_level === 'CRITICAL' ? 'text-red-500' :
                    container.risk_level === 'HIGH' ? 'text-orange-500' :
                    container.risk_level === 'MEDIUM' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{riskPercentage}%</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Risk Score</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <RiskBadge level={container.risk_level} />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Factors</h3>
        <div className="space-y-3">
          {container.explanations.map((explanation, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <p className="text-gray-700 dark:text-gray-300">{explanation}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ContainerDetails;
