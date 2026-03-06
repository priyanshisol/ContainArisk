import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
        navigate('/dashboard');
      } else {
        setError('Please enter valid credentials');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen relative flex items-center p-6 md:p-16 lg:p-24 overflow-hidden text-white font-sans bg-[#111]">
      {/* Background Video to match Landing Page */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/images/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1B33]/90 via-[#0F1B33]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1B33]/60 via-transparent to-[#0F1B33]/30" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 mt-10 xl:px-10">

        {/* Left Side Container */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full md:w-1/2 flex flex-col justify-center xl:pr-20"
        >
          <h1 className="text-6xl md:text-7xl lg:text-[80px] font-bold leading-[1.1] mb-6 tracking-tight">
            WELCOME
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-md leading-relaxed mb-10">
            Our system does not just predict risk. It builds a full customs intelligence platform that prioritizes inspections, detects trade fraud networks, and explains suspicious shipments.
          </p>

          <div className="flex gap-4">
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Facebook className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Twitter className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Instagram className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Youtube className="w-4 h-4 text-white" />
            </a>
          </div>
        </motion.div>

        {/* Right Side Container */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full md:w-1/2 max-w-[420px]"
        >
          <h2 className="text-4xl font-bold mb-8 tracking-tight">Sign in</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 bg-white text-black font-medium focus:ring-2 focus:ring-[#D8572A] outline-none transition-all placeholder-gray-400"
                placeholder=""
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => {
                  setCredentials({ ...credentials, password: e.target.value });
                  setShowValidation(true);
                }}
                className="w-full px-4 py-3 bg-white text-black font-medium focus:ring-2 focus:ring-[#D8572A] outline-none transition-all placeholder-gray-400"
                placeholder=""
                required
              />
              {showValidation && credentials.password && (
                <div className="mt-2 p-3 bg-black/50 border border-white/10 space-y-1.5 backdrop-blur-md text-white">
                  <ValidationItem valid={validation.minLength} text="At least 8 characters" />
                  <ValidationItem valid={validation.hasNumber} text="Contains a number" />
                  <ValidationItem valid={validation.hasLower} text="Contains lowercase letter" />
                  <ValidationItem valid={validation.hasUpper} text="Contains uppercase letter" />
                  <ValidationItem valid={validation.hasSpecial} text="Contains special character" />
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-100 text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center space-x-2 pt-1 pb-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 bg-white border-0 text-[#D8572A] cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm cursor-pointer hover:text-gray-200 transition-colors">Remember Me</label>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading || !isPasswordValid}
                className="bg-[#DE652E] hover:bg-[#E85D04] text-white px-8 py-2.5 shadow-lg shadow-[#DE652E]/20 text-[15px] font-medium transition-all disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in now'}
              </button>
            </div>

            <div className="pt-2">
              <a href="#" className="text-[13px] text-gray-300 hover:text-white hover:underline transition-colors">
                Lost your password?
              </a>
            </div>

            <div className="pt-6 text-[13px] text-gray-300 leading-relaxed">
              By clicking on "Sign in now" you agree to<br />
              <a href="#" className="underline hover:text-white transition-colors">Terms of Service</a> | <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
};

const ValidationItem = ({ valid, text }) => (
  <div className="flex items-center space-x-2 text-xs">
    {valid ? (
      <Check className="w-3.5 h-3.5 text-emerald-400" />
    ) : (
      <X className="w-3.5 h-3.5 text-gray-400" />
    )}
    <span className={valid ? 'text-emerald-400' : 'text-gray-400'}>
      {text}
    </span>
  </div>
);

export default Login;
