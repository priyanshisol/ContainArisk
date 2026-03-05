import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const LowRiskContainers = () => {
  const [containers, setContainers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContainers = async () => {
      setLoading(true);
      setTimeout(() => {
        setContainers([
          { container_id: 'C1004', importer: 'Ocean Freight Ltd', exporter: 'Pacific Exports', origin: 'Hong Kong', destination: 'India', risk_score: 0.23, risk_level: 'LOW', weight: 10000, value: 25000 },
          { container_id: 'C1006', importer: 'Trade Masters', exporter: 'Dubai Exports', origin: 'UAE', destination: 'India', risk_score: 0.15, risk_level: 'LOW', weight: 9000, value: 20000 },
          { container_id: 'C2001', importer: 'Safe Imports', exporter: 'Euro Traders', origin: 'Singapore', destination: 'India', risk_score: 0.18, risk_level: 'LOW', weight: 8500, value: 22000 },
          { container_id: 'C2003', importer: 'Reliable Shipping', exporter: 'Asia Safe', origin: 'Malaysia', destination: 'India', risk_score: 0.21, risk_level: 'LOW', weight: 9500, value: 24000 },
          { container_id: 'C2005', importer: 'Trust Logistics', exporter: 'Pacific Trade', origin: 'Thailand', destination: 'India', risk_score: 0.19, risk_level: 'LOW', weight: 8800, value: 21000 },
        ]);
        setLoading(false);
      }, 500);
    };
    fetchContainers();
  }, []);

  const filtered = containers.filter(c => 
    c.container_id.toLowerCase().includes(search.toLowerCase()) ||
    c.importer.toLowerCase().includes(search.toLowerCase()) ||
    c.origin.toLowerCase().includes(search.toLowerCase())
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
        <CheckCircle className="w-8 h-8 text-green-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Low Risk Containers</h1>
          <p className="text-gray-600 dark:text-gray-400">Containers flagged as LOW risk</p>
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
                placeholder="Search by container ID, importer, or origin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filtered.length} low-risk containers
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Container ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Importer</th>
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
                {filtered.map((container, index) => (
                  <motion.tr
                    key={container.container_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => navigate(`/container/${container.container_id}`)}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">{container.container_id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{container.importer}</td>
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

export default LowRiskContainers;
