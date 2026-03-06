import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import RiskHeatmap from '../components/RiskHeatmap';
import { getCountryRisk, getImporterRisk, getRiskHeatmap } from '../services/api';

const Insights = () => {
  const [countryRisk, setCountryRisk] = useState([]);
  const [importerRisk, setImporterRisk] = useState([]);
  const [heatmapData, setHeatmapData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [country, importer, heatmap] = await Promise.all([
        getCountryRisk(),
        getImporterRisk(),
        getRiskHeatmap()
      ]);
      setCountryRisk(country);
      setImporterRisk(importer);
      setHeatmapData(heatmap);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Insights</h1>
        <p className="text-gray-600 dark:text-gray-400">Deep dive into risk patterns and trends</p>
      </div>

      <RiskHeatmap data={heatmapData} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk by Country</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={countryRisk}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="country" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Bar dataKey="risk_count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Risky Importers</h3>
        <div className="space-y-3">
          {importerRisk.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/importer/${encodeURIComponent(item.importer)}`)}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-lg transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{item.importer}</span>
              </div>
              <span className="text-red-500 font-bold">{item.risk_count} alerts</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Insights;
