import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, User, Check, X } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>_]/.test(password)
    };
  };

  const validation = validatePassword(credentials.password);
  const isPasswordValid = Object.values(validation).every(v => v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Password does not meet requirements');
      setShowValidation(true);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (credentials.username && credentials.password) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('officerName', credentials.username);
        onLogin();
        navigate('/');
      } else {
        setError('Please enter valid credentials');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">SmartContainer</h1>
          <p className="text-gray-600 dark:text-gray-400">Customs Officer Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Officer ID / Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your officer ID"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => {
                  setCredentials({ ...credentials, password: e.target.value });
                  setShowValidation(true);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
            {showValidation && credentials.password && (
              <div className="mt-3 space-y-2">
                <ValidationItem valid={validation.minLength} text="At least 8 characters" />
                <ValidationItem valid={validation.hasNumber} text="Contains a number" />
                <ValidationItem valid={validation.hasLower} text="Contains lowercase letter" />
                <ValidationItem valid={validation.hasUpper} text="Contains uppercase letter" />
                <ValidationItem valid={validation.hasSpecial} text="Contains special character" />
              </div>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>


      </motion.div>
    </div>
  );
};

const ValidationItem = ({ valid, text }) => (
  <div className="flex items-center space-x-2 text-sm">
    {valid ? (
      <Check className="w-4 h-4 text-green-500" />
    ) : (
      <X className="w-4 h-4 text-red-500" />
    )}
    <span className={valid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
      {text}
    </span>
  </div>
);

export default Login;
