import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, CheckCircle, Activity, TrendingUp, Clock, Zap } from 'lucide-react';
import StatCard from '../components/StatCard';
import RiskPieChart from '../components/RiskPieChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { getSummary, getRiskDistribution } from '../services/api';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [riskDist, setRiskDist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [summaryData, distData] = await Promise.all([
        getSummary(),
        getRiskDistribution()
      ]);
      setSummary(summaryData);
      setRiskDist(distData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-slate-100 tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time container risk analytics overview</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Containers"
          value={summary.total_containers}
          icon={Package}
          color="bg-blue-500"
          delay={0}
          clickable={true}
          link="/containers"
        />
        <StatCard
          title="High Risk"
          value={summary.high_risk}
          icon={AlertTriangle}
          color="bg-red-500"
          delay={0.1}
          clickable={true}
          link="/high-risk"
        />
        <StatCard
          title="Low Risk"
          value={summary.low_risk}
          icon={CheckCircle}
          color="bg-green-500"
          delay={0.2}
          clickable={true}
          link="/low-risk"
        />
        <StatCard
          title="Anomalies"
          value={summary.anomalies}
          icon={Activity}
          color="bg-orange-500"
          delay={0.3}
          clickable={true}
          link="/anomalies"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskPieChart data={riskDist} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="card-premium p-6"
        >
          <h3 className="text-base font-bold text-[#1B2A4A] dark:text-slate-100 mb-5">Performance Metrics</h3>
          <div className="space-y-3">
            <MetricRow
              icon={TrendingUp}
              label="Detection Rate"
              value="94.2%"
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <MetricRow
              icon={Clock}
              label="Avg Processing Time"
              value="1.2s"
              color="text-indigo-600"
              bgColor="bg-indigo-50"
            />
            <MetricRow
              icon={Zap}
              label="Active Alerts"
              value={summary.high_risk}
              color="text-red-600"
              bgColor="bg-red-50"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const MetricRow = ({ icon: Icon, label, value, color, bgColor }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-lg ${bgColor}`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <span className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">{label}</span>
    </div>
    <span className={`text-lg font-bold ${color}`}>{value}</span>
  </div>
);

export default Dashboard;
