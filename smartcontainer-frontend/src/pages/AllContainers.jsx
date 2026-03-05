import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { getContainers } from '../services/api';

const AllContainers = () => {
  const [containers, setContainers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const navigate = useNavigate();

  const fetchContainers = async () => {
    setLoading(true);
    try {
      const response = await getContainers(page, limit);
      // Map Supabase columns to UI expected keys if necessary
      const mapped = response.data.map(c => ({
        container_id: c.Container_ID,
        importer: c.Importer_ID,
        exporter: c.Exporter_ID,
        origin: c.Origin_Country,
        destination: c.Destination_Country,
        weight: c.Measured_Weight || 0,
        value: c.Declared_Value || 0,
        risk_score: c.Risk_Score !== null ? c.Risk_Score / 100 : 0,
        risk_level: c.Risk_Level || 'LOW'
      }));
      setContainers(mapped);
      setTotalPages(response.total_pages || 1);
      setTotalRecords(response.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, [page]); // Re-fetch when page changes

  const filtered = containers.filter(c => {
    const matchesSearch = c.container_id?.toLowerCase().includes(search.toLowerCase()) ||
      c.importer?.toLowerCase().includes(search.toLowerCase()) ||
      c.origin?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || c.risk_level === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <button
          onClick={() => navigate('/create-container')}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Container</span>
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">All Containers</h1>
        <p className="text-gray-600 dark:text-gray-400">Complete list of all container shipments</p>
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
                placeholder="Search by container ID, importer, or origin (client-side filter on this page)..."
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
              <option value="ALL">All Risk Levels</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filtered.length} on this page (Total DB Records: {totalRecords})
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
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
          )}

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages === 0 ? 1 : totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AllContainers;
