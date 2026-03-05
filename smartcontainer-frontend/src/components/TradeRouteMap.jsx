import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

const TradeRouteMap = ({ routes }) => {
  const getColor = (risk) => {
    switch (risk) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#3b82f6';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Global Trade Routes</h3>
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
          
          {routes.map((route, index) => (
            <div key={index}>
              <Polyline
                positions={[
                  [route.lat1, route.lon1],
                  [route.lat2, route.lon2]
                ]}
                color={getColor(route.risk)}
                weight={3}
                opacity={0.7}
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
      
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Low Risk</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Medium Risk</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">High Risk</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TradeRouteMap;
