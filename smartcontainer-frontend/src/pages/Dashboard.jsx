import { useEffect, useState } from 'react';
import { Package, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Real-time container risk analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          title="High Risk Containers"
          value={summary.high_risk}
          icon={AlertTriangle}
          color="bg-red-500"
          delay={0.1}
          clickable={true}
          link="/high-risk"
        />
        <StatCard
          title="Low Risk Containers"
          value={summary.low_risk}
          icon={CheckCircle}
          color="bg-green-500"
          delay={0.2}
          clickable={true}
          link="/low-risk"
        />
        <StatCard
          title="Detected Anomalies"
          value={summary.anomalies}
          icon={Activity}
          color="bg-orange-500"
          delay={0.3}
          clickable={true}
          link="/anomalies"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskPieChart data={riskDist} />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Detection Rate</span>
              <span className="font-bold text-gray-900 dark:text-white">94.2%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Avg Processing Time</span>
              <span className="font-bold text-gray-900 dark:text-white">1.2s</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Active Alerts</span>
              <span className="font-bold text-gray-900 dark:text-white">{summary.high_risk}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
