import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { getContainerDetails } from '../services/api';

const ContainerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [container, setContainer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const data = await getContainerDetails(id);
      setContainer(data);
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  const riskPercentage = (container.risk_score * 100).toFixed(0);

  return (
    <div className="space-y-6">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-slate-100 tracking-tight">Container Details</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{container.container_id}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 card-premium p-6"
        >
          <h3 className="text-base font-bold text-[#1B2A4A] dark:text-slate-100 mb-4">Shipment Information</h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Importer</p>
              <p className="font-bold text-[#1B2A4A] dark:text-slate-100 text-sm">{container.importer}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Exporter</p>
              <p className="font-bold text-[#1B2A4A] dark:text-slate-100 text-sm">{container.exporter}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Origin</p>
              <p className="font-bold text-[#1B2A4A] dark:text-slate-100 text-sm">{container.origin}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Destination</p>
              <p className="font-bold text-[#1B2A4A] dark:text-slate-100 text-sm">{container.destination}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Weight</p>
              <p className="font-bold text-[#1B2A4A] dark:text-slate-100 text-sm">{container.weight.toLocaleString()} kg</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Declared Value</p>
              <p className="font-bold text-[#1B2A4A] dark:text-slate-100 text-sm">${container.declared_value.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700 col-span-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">HS Code</p>
              <p className="font-bold text-[#1B2A4A] dark:text-slate-100 text-sm">{container.hs_code}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-premium p-6"
        >
          <h3 className="text-base font-bold text-[#1B2A4A] dark:text-slate-100 mb-4">Risk Assessment</h3>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="transform -rotate-90 w-40 h-40">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent"
                  className="text-gray-100" />
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - container.risk_score)}`}
                  className={`${container.risk_level === 'CRITICAL' ? 'text-red-500' :
                    container.risk_level === 'HIGH' ? 'text-orange-500' :
                      container.risk_level === 'MEDIUM' ? 'text-amber-500' :
                        'text-emerald-500'
                    }`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-[#1B2A4A] dark:text-slate-100">{riskPercentage}%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Risk Score</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <RiskBadge level={container.risk_level} />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-premium p-6"
      >
        <h3 className="text-base font-bold text-[#1B2A4A] dark:text-slate-100 mb-4">Risk Factors</h3>
        <div className="space-y-3">
          {container.explanations.map((explanation, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-red-50 rounded-xl border border-red-100 border-l-[4px] border-l-red-500 shadow-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-sm font-medium text-gray-700">{explanation}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ContainerDetails;
