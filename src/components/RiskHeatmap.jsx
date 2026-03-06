import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const RiskHeatmap = ({ data }) => {
  const chartData = Object.entries(data).map(([country, count]) => ({
    country,
    count
  }));

  const getColor = (value) => {
    if (value > 30) return '#ef4444';
    if (value > 20) return '#f97316';
    if (value > 10) return '#f59e0b';
    return '#10b981';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium p-6"
    >
      <h3 className="text-base font-bold text-[#1B2A4A] dark:text-slate-100 mb-1">Risk Heatmap by Country</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Geographical distribution of flagged shipments</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="country" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              color: '#1B2A4A',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: '#1B2A4A', fontWeight: 600 }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.count)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default RiskHeatmap;
