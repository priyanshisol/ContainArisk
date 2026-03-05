import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Package, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const ImporterDetails = () => {
  const { name } = useParams();
  const [containers, setContainers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setTimeout(() => {
        // Mock data - replace with actual API call
        const importerName = decodeURIComponent(name);
        
        if (importerName === 'ABC Imports Ltd') {
          setContainers([
            { container_id: 'C1001', exporter: 'XYZ Exports', origin: 'China', destination: 'India', risk_score: 0.89, risk_level: 'HIGH', weight: 15000, value: 50000 },
            { container_id: 'C7823', exporter: 'China Direct', origin: 'China', destination: 'India', risk_score: 0.91, risk_level: 'CRITICAL', weight: 19000, value: 80000 }
          ]);
          setAlerts([
            { container_id: 'C1001', message: 'Weight mismatch detected', severity: 'HIGH' },
            { container_id: 'C7823', message: 'Severe weight mismatch detected', severity: 'CRITICAL' },
            { container_id: 'C7823', message: 'Route deviation detected', severity: 'HIGH' }
          ]);
        } else if (importerName === 'Global Trade Co') {
          setContainers([
            { container_id: 'C1002', exporter: 'Asia Exports', origin: 'UAE', destination: 'India', risk_score: 0.92, risk_level: 'CRITICAL', weight: 18000, value: 75000 },
            { container_id: 'C5621', exporter: 'UAE Exports', origin: 'UAE', destination: 'India', risk_score: 0.87, risk_level: 'HIGH', weight: 16500, value: 70000 }
          ]);
          setAlerts([
            { container_id: 'C1002', message: 'Unusual value-to-weight ratio', severity: 'CRITICAL' },
            { container_id: 'C5621', message: 'Exporter flagged in previous shipments', severity: 'HIGH' }
          ]);
        } else {
          setContainers([
            { container_id: 'C1003', exporter: 'Euro Trade', origin: 'Singapore', destination: 'India', risk_score: 0.45, risk_level: 'MEDIUM', weight: 12000, value: 35000 }
          ]);
          setAlerts([
            { container_id: 'C1003', message: 'Minor documentation inconsistency', severity: 'MEDIUM' }
          ]);
        }
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, [name]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Insights</span>
      </button>

      <div className="flex items-center space-x-3">
        <Building2 className="w-8 h-8 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{decodeURIComponent(name)}</h1>
          <p className="text-gray-600 dark:text-gray-400">Importer details, containers, and alerts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Containers</h3>
          <p className="text-3xl font-bold text-blue-500">{containers.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">High Risk</h3>
          <p className="text-3xl font-bold text-red-500">
            {containers.filter(c => c.risk_level === 'HIGH' || c.risk_level === 'CRITICAL').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Active Alerts</h3>
          <p className="text-3xl font-bold text-orange-500">{alerts.length}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Alerts</h3>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'CRITICAL' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                alert.severity === 'HIGH' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500' :
                'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                    alert.severity === 'CRITICAL' ? 'text-red-500' :
                    alert.severity === 'HIGH' ? 'text-orange-500' :
                    'text-yellow-500'
                  }`} />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Container {alert.container_id}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{alert.message}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' :
                  alert.severity === 'HIGH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                }`}>
                  {alert.severity}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Containers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Container ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Exporter</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Origin</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Destination</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Weight (kg)</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Value (USD)</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Risk Score</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Risk Level</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {containers.map((container, index) => (
                  <motion.tr
                    key={container.container_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    onClick={() => navigate(`/container/${container.container_id}`)}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">{container.container_id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{container.exporter}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{container.origin}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{container.destination}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{container.weight.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">${container.value.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-semibold">{container.risk_score.toFixed(2)}</td>
                    <td className="py-3 px-4"><RiskBadge level={container.risk_level} /></td>
                    <td className="py-3 px-4">
                      <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">View</button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImporterDetails;
