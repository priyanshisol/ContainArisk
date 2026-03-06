import { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadContainers } from '../services/api';

const UploadCard = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
  };

  const handleUpload = async (file) => {
    setUploading(true);
    setProgress(0);
    setStatus(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await uploadContainers(file);
      setProgress(100);
      setStatus('success');
      clearInterval(interval);
      setTimeout(() => {
        if (onUploadSuccess) onUploadSuccess();
      }, 1500);
    } catch (error) {
      setStatus('error');
      clearInterval(interval);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!uploading && !status && (
          <>
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Upload Container Data</h3>
            <p className="text-gray-600 dark:text-gray-400">Drag and drop CSV file or click to browse</p>
          </>
        )}

        {uploading && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-900 dark:text-white font-medium">Processing...</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{progress}%</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Successful!</h3>
            <p className="text-gray-600 dark:text-gray-400">Redirecting to dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Failed</h3>
            <p className="text-gray-600 dark:text-gray-400">Please try again</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UploadCard;
