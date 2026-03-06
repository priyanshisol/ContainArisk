import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const DetectedAnomalies = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnomalies = async () => {
      setLoading(true);
      setTimeout(() => {
        setAnomalies([
          { container_id: 'C1002', importer: 'Global Trade Co', exporter: 'Asia Exports', origin: 'UAE', risk_score: 0.92, risk_level: 'CRITICAL', anomaly_type: 'Weight Mismatch', anomaly_details: 'Declared weight 30% lower than expected' },
          { container_id: 'C1005', importer: 'Swift Logistics', exporter: 'China Exports', origin: 'China', risk_score: 0.78, risk_level: 'HIGH', anomaly_type: 'Value Anomaly', anomaly_details: 'Unusual value-to-weight ratio detected' },
          { container_id: 'C7823', importer: 'ABC Imports', exporter: 'China Direct', origin: 'China', risk_score: 0.91, risk_level: 'CRITICAL', anomaly_type: 'Route Deviation', anomaly_details: 'Unexpected route change detected' },
          { container_id: 'C1008', importer: 'Global Imports', exporter: 'HK Trading', origin: 'Hong Kong', risk_score: 0.88, risk_level: 'HIGH', anomaly_type: 'Document Inconsistency', anomaly_details: 'Mismatch in shipping documents' },
          { container_id: 'C3401', importer: 'Fast Trade Inc', exporter: 'Singapore Exports', origin: 'Singapore', risk_score: 0.65, risk_level: 'MEDIUM', anomaly_type: 'HS Code Mismatch', anomaly_details: 'Declared HS code inconsistent with description' },
          { container_id: 'C5621', importer: 'Global Trade Co', exporter: 'UAE Exports', origin: 'UAE', risk_score: 0.87, risk_level: 'HIGH', anomaly_type: 'Exporter Flag', anomaly_details: 'Exporter flagged in previous shipments' },
        ]);
        setLoading(false);
      }, 500);
    };
    fetchAnomalies();
  }, []);

  const filtered = anomalies.filter(a => 
    a.container_id.toLowerCase().includes(search.toLowerCase()) ||
    a.importer.toLowerCase().includes(search.toLowerCase()) ||
    a.anomaly_type.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </button>

      <div className="flex items-center space-x-3">
        <Activity className="w-8 h-8 text-orange-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Detected Anomalies</h1>
          <p className="text-gray-600 dark:text-gray-400">Containers with detected anomalies and irregularities</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by container ID, importer, or anomaly type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filtered.length} detected anomalies
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Container ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Importer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Exporter</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Origin</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Anomaly Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Details</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Risk Score</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Risk Level</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((anomaly, index) => (
                  <motion.tr
                    key={anomaly.container_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => navigate(`/container/${anomaly.container_id}`)}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">{anomaly.container_id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{anomaly.importer}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{anomaly.exporter}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{anomaly.origin}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded text-xs font-medium">
                        {anomaly.anomaly_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{anomaly.anomaly_details}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-semibold">{anomaly.risk_score.toFixed(2)}</td>
                    <td className="py-3 px-4"><RiskBadge level={anomaly.risk_level} /></td>
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

export default DetectedAnomalies;
