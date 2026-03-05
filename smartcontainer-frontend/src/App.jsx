import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AIChatPanel from './components/AIChatPanel';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import ContainerDetails from './pages/ContainerDetails';
import Insights from './pages/Insights';
import Intelligence from './pages/Intelligence';
import AllContainers from './pages/AllContainers';
import HighRiskContainers from './pages/HighRiskContainers';
import LowRiskContainers from './pages/LowRiskContainers';
import DetectedAnomalies from './pages/DetectedAnomalies';
import ActiveRoutes from './pages/ActiveRoutes';
import HighRiskRoutes from './pages/HighRiskRoutes';
import ImporterDetails from './pages/ImporterDetails';
import CreateContainer from './pages/CreateContainer';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('officerName');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
        } />

        <Route path="/*" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Navbar darkMode={darkMode} setDarkMode={setDarkMode} onLogout={handleLogout} />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/containers" element={<AllContainers />} />
                    <Route path="/create-container" element={<CreateContainer />} />
                    <Route path="/high-risk" element={<HighRiskContainers />} />
                    <Route path="/low-risk" element={<LowRiskContainers />} />
                    <Route path="/anomalies" element={<DetectedAnomalies />} />
                    <Route path="/active-routes" element={<ActiveRoutes />} />
                    <Route path="/high-risk-routes" element={<HighRiskRoutes />} />
                    <Route path="/importer/:name" element={<ImporterDetails />} />
                    <Route path="/container/:id" element={<ContainerDetails />} />
                    <Route path="/insights" element={<Insights />} />
                    <Route path="/intelligence" element={<Intelligence />} />
                  </Routes>
                </main>
              </div>
              <AIChatPanel />
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
