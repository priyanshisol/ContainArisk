import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import TradeRouteMap from '../components/TradeRouteMap';
import { getTradeRoutes } from '../services/api';

const Intelligence = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getTradeRoutes();
      setRoutes(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Trade Intelligence</h1>
        <p className="text-gray-600 dark:text-gray-400">Global trade routes and risk visualization</p>
      </div>

      <TradeRouteMap routes={routes} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/active-routes')}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-2xl hover:scale-105 hover:border-blue-500 dark:hover:border-blue-400 transition-all"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Active Routes</h3>
          <p className="text-3xl font-bold text-blue-500">{routes.length}</p>
        </div>
        <div
          onClick={() => navigate('/high-risk-routes')}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-2xl hover:scale-105 hover:border-blue-500 dark:hover:border-blue-400 transition-all"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">High Risk Routes</h3>
          <p className="text-3xl font-bold text-red-500">{routes.filter(r => r.risk === 'high').length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Countries Monitored</h3>
          <p className="text-3xl font-bold text-green-500">{new Set(routes.map(r => r.origin)).size}</p>
        </div>
      </div>
    </div>
  );
};

export default Intelligence;
