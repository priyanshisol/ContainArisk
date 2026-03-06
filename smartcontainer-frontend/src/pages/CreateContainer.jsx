import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { createContainer } from '../services/api';

const CreateContainer = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        Container_ID: '',
        Declaration_Date: new Date().toISOString().split('T')[0],
        Trade_Regime: 'Import',
        Origin_Country: '',
        Destination_Country: '',
        Destination_Port: '',
        HS_Code: '',
        Importer_ID: '',
        Exporter_ID: '',
        Declared_Value: '',
        Declared_Weight: '',
        Measured_Weight: '',
        Shipping_Line: '',
        Dwell_Time_Hours: '',
        Clearance_Status: 'Pending',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Clean up number fields
            const payload = {
                ...formData,
                Declared_Value: parseFloat(formData.Declared_Value) || 0,
                Declared_Weight: parseFloat(formData.Declared_Weight) || 0,
                Measured_Weight: parseFloat(formData.Measured_Weight) || 0,
                Dwell_Time_Hours: parseFloat(formData.Dwell_Time_Hours) || 0,
            };

            const result = await createContainer(payload);
            if (result && result.Container_ID) {
                navigate(`/container/${result.Container_ID}`);
            } else {
                setError('Failed to create container');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while creating the container');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
            </button>

            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Container</h1>
                <p className="text-gray-600 dark:text-gray-400">Enter container details for risk assessment</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Container ID *</label>
                            <input required name="Container_ID" value={formData.Container_ID} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Declaration Date *</label>
                            <input type="date" required name="Declaration_Date" value={formData.Declaration_Date} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Origin Country</label>
                            <input name="Origin_Country" value={formData.Origin_Country} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination Country</label>
                            <input name="Destination_Country" value={formData.Destination_Country} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Importer ID</label>
                            <input name="Importer_ID" value={formData.Importer_ID} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exporter ID</label>
                            <input name="Exporter_ID" value={formData.Exporter_ID} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Declared Value (USD)</label>
                            <input type="number" step="0.01" name="Declared_Value" value={formData.Declared_Value} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HS Code</label>
                            <input name="HS_Code" value={formData.HS_Code} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Declared Weight (kg)</label>
                            <input type="number" step="0.01" name="Declared_Weight" value={formData.Declared_Weight} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Measured Weight (kg)</label>
                            <input type="number" step="0.01" name="Measured_Weight" value={formData.Measured_Weight} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dwell Time (Hours)</label>
                            <input type="number" step="0.1" name="Dwell_Time_Hours" value={formData.Dwell_Time_Hours} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trade Regime</label>
                            <select name="Trade_Regime" value={formData.Trade_Regime} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                <option value="Import">Import</option>
                                <option value="Export">Export</option>
                                <option value="Transit">Transit</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            <span>{loading ? 'Processing...' : 'Assess & Save Container'}</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateContainer;
