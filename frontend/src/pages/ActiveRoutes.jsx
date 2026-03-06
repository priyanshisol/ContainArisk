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
            id: 1, origin: 'China', destination: 'India', risk: 'high', lat1: 31.2304, lon1: 121.4737, lat2: 19.0760, lon2: 72.8777,
            containers: [
              { container_id: 'C1001', importer: 'ABC Imports Ltd', risk_score: 0.89, risk_level: 'HIGH' },
              { container_id: 'C1005', importer: 'Swift Logistics', risk_score: 0.78, risk_level: 'HIGH' }
            ]
          },
          {
            id: 2, origin: 'UAE', destination: 'India', risk: 'low', lat1: 25.2048, lon1: 55.2708, lat2: 19.0760, lon2: 72.8777,
            containers: [{ container_id: 'C1006', importer: 'Trade Masters', risk_score: 0.15, risk_level: 'LOW' }]
          },
          {
            id: 3, origin: 'Singapore', destination: 'India', risk: 'medium', lat1: 1.3521, lon1: 103.8198, lat2: 13.0827, lon2: 80.2707,
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
      default: return '#22c55e';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} whileHover={{ x: -4 }}
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Trade Intelligence</span>
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-slate-100 tracking-tight">Active Trade Routes</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View routes and containers on each route</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="card-premium p-6">
            <h3 className="text-base font-bold text-[#1B2A4A] dark:text-slate-100 mb-4">Route Map</h3>
            <div className="h-[500px] rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-inner">
              <MapContainer center={[20, 80]} zoom={3} style={{ height: '100%', width: '100%' }} className="z-0">
                <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>' />
                {routes.map((route) => (
                  <div key={route.id}>
                    <Polyline positions={[[route.lat1, route.lon1], [route.lat2, route.lon2]]}
                      color={getColor(route.risk)}
                      weight={selectedRoute?.id === route.id ? 5 : 3}
                      opacity={selectedRoute?.id === route.id ? 1 : 0.8}
                      eventHandlers={{ click: () => setSelectedRoute(route) }} />
                    <CircleMarker center={[route.lat1, route.lon1]} radius={6} fillColor={getColor(route.risk)}
                      color="#ffffff" weight={2} fillOpacity={0.9}>
                      <Popup>{route.origin}</Popup>
                    </CircleMarker>
                    <CircleMarker center={[route.lat2, route.lon2]} radius={6} fillColor={getColor(route.risk)}
                      color="#ffffff" weight={2} fillOpacity={0.9}>
                      <Popup>{route.destination}</Popup>
                    </CircleMarker>
                  </div>
                ))}
              </MapContainer>
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="card-premium p-6 border-gray-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-[#1B2A4A] dark:text-slate-100 mb-4">Routes</h3>
            <div className="space-y-3">
              {routes.map((route) => (
                <div key={route.id} onClick={() => setSelectedRoute(route)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedRoute?.id === route.id
                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                    : 'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:border-blue-300 hover:bg-blue-50/30'
                    }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="font-bold text-[#1B2A4A] dark:text-slate-100 text-sm">{route.origin} → {route.destination}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{route.containers.length} containers</span>
                    <span className={`px-2 py-1 rounded-[6px] text-[10px] font-bold ${route.risk === 'high' ? 'bg-red-50 text-red-700 border border-red-200' :
                      route.risk === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>{route.risk.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {selectedRoute && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="card-premium p-6">
              <h3 className="text-base font-bold text-[#1B2A4A] dark:text-slate-100 mb-4">Containers on Route</h3>
              <div className="space-y-3">
                {selectedRoute.containers.map((container) => (
                  <div key={container.container_id}
                    onClick={() => navigate(`/container/${container.container_id}`)}
                    className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700 cursor-pointer hover:bg-blue-50/50 transition-colors shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-bold text-[#1B2A4A] dark:text-slate-100 text-sm">{container.container_id}</span>
                      </div>
                      <RiskBadge level={container.risk_level} />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{container.importer}</p>
                    <p className="text-sm text-[#1B2A4A] dark:text-slate-100 font-semibold mt-1">Risk Score: {container.risk_score.toFixed(2)}</p>
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
