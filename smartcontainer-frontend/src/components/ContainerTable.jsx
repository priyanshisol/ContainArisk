import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import RiskBadge from './RiskBadge';

const ContainerTable = ({ containers }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  const filtered = containers.filter(c => {
    const matchesSearch = c.container_id.toLowerCase().includes(search.toLowerCase()) ||
                         c.importer.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || c.risk_level === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">High Risk Containers</h3>
        
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search containers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Levels</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Container ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Importer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Exporter</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Origin</th>
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
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/container/${container.container_id}`)}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">{container.container_id}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{container.importer}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{container.exporter}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{container.origin}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-semibold">{container.risk_score.toFixed(2)}</td>
                  <td className="py-3 px-4"><RiskBadge level={container.risk_level} /></td>
                  <td className="py-3 px-4">
                    <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">View Details</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ContainerTable;
