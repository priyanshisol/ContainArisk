import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Package, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import 'leaflet/dist/leaflet.css';

const HighRiskRoutes = () => {
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
              { container_id: 'C1001', importer: 'ABC Imports Ltd', exporter: 'XYZ Exports', risk_score: 0.89, risk_level: 'HIGH', weight: 15000, value: 50000 },
              { container_id: 'C1005', importer: 'Swift Logistics', exporter: 'China Exports', risk_score: 0.78, risk_level: 'HIGH', weight: 16000, value: 60000 }
            ]
          },
          {
            id: 2,
            origin: 'Hong Kong',
            destination: 'India',
            risk: 'high',
            lat1: 22.3193,
            lon1: 114.1694,
            lat2: 19.0760,
            lon2: 72.8777,
            containers: [
              { container_id: 'C1008', importer: 'Global Imports', exporter: 'HK Trading', risk_score: 0.88, risk_level: 'HIGH', weight: 17000, value: 65000 }
            ]
          },
          {
            id: 3,
            origin: 'China',
            destination: 'Mumbai',
            risk: 'high',
            lat1: 31.2304,
            lon1: 121.4737,
            lat2: 19.0760,
            lon2: 72.8777,
            containers: [
              { container_id: 'C7823', importer: 'ABC Imports', exporter: 'China Direct', risk_score: 0.91, risk_level: 'CRITICAL', weight: 19000, value: 80000 }
            ]
          }
        ]);
        setLoading(false);
      }, 500);
    };
    fetchRoutes();
  }, []);

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

      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-8 h-8 text-red-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">High Risk Routes</h1>
          <p className="text-gray-600 dark:text-gray-400">Routes flagged as high risk with container details</p>
        </div>
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
                      color="#ef4444"
                      weight={selectedRoute?.id === route.id ? 5 : 3}
                      opacity={selectedRoute?.id === route.id ? 1 : 0.7}
                      eventHandlers={{
                        click: () => setSelectedRoute(route)
                      }}
                    />
                    <CircleMarker
                      center={[route.lat1, route.lon1]}
                      radius={6}
                      fillColor="#ef4444"
                      color="#fff"
                      weight={2}
                      fillOpacity={0.8}
                    >
                      <Popup>{route.origin}</Popup>
                    </CircleMarker>
                    <CircleMarker
                      center={[route.lat2, route.lon2]}
                      radius={6}
                      fillColor="#ef4444"
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">High Risk Routes</h3>
            <div className="space-y-3">
              {routes.map((route) => (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedRoute?.id === route.id
                      ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
                      : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-red-300 dark:hover:border-red-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {route.origin} → {route.destination}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {route.containers.length} containers
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                      HIGH RISK
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
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border-l-4 border-red-500"
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
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Importer:</span> {container.importer}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Exporter:</span> {container.exporter}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          Risk Score: {container.risk_score.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {container.weight.toLocaleString()} kg | ${container.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
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

export default HighRiskRoutes;
