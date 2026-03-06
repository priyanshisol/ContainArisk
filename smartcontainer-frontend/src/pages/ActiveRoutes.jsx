import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import 'leaflet/dist/leaflet.css';

const ActiveRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      setTimeout(() => {
        setRoutes([
          {
            id: 1,
            origin: 'China',
            destination: 'India',
            risk: 'high',
            lat1: 31.2304,
            lon1: 121.4737,
            lat2: 19.0760,
            lon2: 72.8777,
            containers: [
              { container_id: 'C1001', importer: 'ABC Imports Ltd', risk_score: 0.89, risk_level: 'HIGH' },
              { container_id: 'C1005', importer: 'Swift Logistics', risk_score: 0.78, risk_level: 'HIGH' }
            ]
          },
          {
            id: 2,
            origin: 'UAE',
            destination: 'India',
            risk: 'low',
            lat1: 25.2048,
            lon1: 55.2708,
            lat2: 19.0760,
            lon2: 72.8777,
            containers: [
              { container_id: 'C1006', importer: 'Trade Masters', risk_score: 0.15, risk_level: 'LOW' }
            ]
          },
          {
            id: 3,
            origin: 'Singapore',
            destination: 'India',
            risk: 'medium',
            lat1: 1.3521,
            lon1: 103.8198,
            lat2: 13.0827,
            lon2: 80.2707,
            containers: [
              { container_id: 'C1003', importer: 'Fast Shipping Inc', risk_score: 0.45, risk_level: 'MEDIUM' },
              { container_id: 'C1007', importer: 'Import Solutions', risk_score: 0.56, risk_level: 'MEDIUM' }
            ]
          }
        ]);
        setLoading(false);
      }, 500);
    };
    fetchRoutes();
  }, []);

  const getColor = (risk) => {
    switch (risk) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#3b82f6';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Trade Intelligence</span>
      </button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Active Trade Routes</h1>
        <p className="text-gray-600 dark:text-gray-400">View routes and containers on each route</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Route Map</h3>
            <div className="h-[500px] rounded-lg overflow-hidden">
              <MapContainer
                center={[20, 80]}
                zoom={3}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                
                {routes.map((route) => (
                  <div key={route.id}>
                    <Polyline
                      positions={[
                        [route.lat1, route.lon1],
                        [route.lat2, route.lon2]
                      ]}
                      color={getColor(route.risk)}
                      weight={selectedRoute?.id === route.id ? 5 : 3}
                      opacity={selectedRoute?.id === route.id ? 1 : 0.7}
                      eventHandlers={{
                        click: () => setSelectedRoute(route)
                      }}
                    />
                    <CircleMarker
                      center={[route.lat1, route.lon1]}
                      radius={6}
                      fillColor={getColor(route.risk)}
                      color="#fff"
                      weight={2}
                      fillOpacity={0.8}
                    >
                      <Popup>{route.origin}</Popup>
                    </CircleMarker>
                    <CircleMarker
                      center={[route.lat2, route.lon2]}
                      radius={6}
                      fillColor={getColor(route.risk)}
                      color="#fff"
                      weight={2}
                      fillOpacity={0.8}
                    >
                      <Popup>{route.destination}</Popup>
                    </CircleMarker>
                  </div>
                ))}
              </MapContainer>
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Routes</h3>
            <div className="space-y-3">
              {routes.map((route) => (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedRoute?.id === route.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                      : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {route.origin} → {route.destination}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {route.containers.length} containers
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      route.risk === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' :
                      route.risk === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                    }`}>
                      {route.risk.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {selectedRoute && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Containers on Route
              </h3>
              <div className="space-y-3">
                {selectedRoute.containers.map((container) => (
                  <div
                    key={container.container_id}
                    onClick={() => navigate(`/container/${container.container_id}`)}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {container.container_id}
                        </span>
                      </div>
                      <RiskBadge level={container.risk_level} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{container.importer}</p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium mt-1">
                      Risk Score: {container.risk_score.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveRoutes;
