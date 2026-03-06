import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSummary = async () => {
  try {
    const response = await api.get('/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching summary:', error);
    return {
      total_containers: 1200,
      high_risk: 86,
      low_risk: 1114,
      anomalies: 42
    };
  }
};

export const getRiskDistribution = async () => {
  try {
    const response = await api.get('/risk-distribution');
    return response.data;
  } catch (error) {
    console.error('Error fetching risk distribution:', error);
    return {
      low: 800,
      medium: 200,
      high: 80,
      critical: 20
    };
  }
};

export const getHighRiskContainers = async () => {
  try {
    const response = await api.get('/high-risk-containers');
    return response.data;
  } catch (error) {
    console.error('Error fetching high risk containers:', error);
    return [
      {
        container_id: 'C1001',
        importer: 'ABC Imports Ltd',
        exporter: 'XYZ Exports',
        origin: 'China',
        risk_score: 0.89,
        risk_level: 'HIGH'
      },
      {
        container_id: 'C1002',
        importer: 'Global Trade Co',
        exporter: 'Asia Exports',
        origin: 'UAE',
        risk_score: 0.92,
        risk_level: 'CRITICAL'
      }
    ];
  }
};

export const uploadContainers = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await api.post('/upload-containers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading containers:', error);
    throw error;
  }
};

export const createContainer = async (containerData) => {
  try {
    const response = await api.post('/container', containerData);
    return response.data;
  } catch (error) {
    console.error('Error creating container:', error);
    throw error;
  }
};

export const getContainers = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(`/containers?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching paginated containers:', error);
    return { data: [], page: 1, limit: 20, total: 0, total_pages: 0 };
  }
};

export const getContainerDetails = async (id) => {
  try {
    const response = await api.get(`/container/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching container details:', error);
    return {
      container_id: id,
      importer: 'ABC Imports Ltd',
      exporter: 'XYZ Exports',
      origin: 'China',
      destination: 'India',
      risk_score: 0.89,
      risk_level: 'HIGH',
      weight: 15000,
      declared_value: 50000,
      hs_code: '8471.30',
      explanations: [
        'Weight mismatch detected',
        'Unusual value-to-weight ratio',
        'Exporter flagged previously'
      ]
    };
  }
};

export const getCountryRisk = async () => {
  try {
    const response = await api.get('/country-risk');
    return response.data;
  } catch (error) {
    console.error('Error fetching country risk:', error);
    return [
      { country: 'China', risk_count: 45 },
      { country: 'UAE', risk_count: 30 },
      { country: 'Singapore', risk_count: 20 },
      { country: 'Hong Kong', risk_count: 15 }
    ];
  }
};

export const getImporterRisk = async () => {
  try {
    const response = await api.get('/importer-risk');
    return response.data;
  } catch (error) {
    console.error('Error fetching importer risk:', error);
    return [
      { importer: 'ABC Imports Ltd', risk_count: 12 },
      { importer: 'Global Trade Co', risk_count: 10 },
      { importer: 'Fast Shipping Inc', risk_count: 8 },
      { importer: 'Ocean Freight Ltd', risk_count: 6 }
    ];
  }
};

export const getTradeRoutes = async () => {
  try {
    const response = await api.get('/trade-routes');
    return response.data;
  } catch (error) {
    console.error('Error fetching trade routes:', error);
    return [
      { origin: 'China', destination: 'India', risk: 'high', lat1: 31.2304, lon1: 121.4737, lat2: 19.0760, lon2: 72.8777 },
      { origin: 'UAE', destination: 'India', risk: 'low', lat1: 25.2048, lon1: 55.2708, lat2: 19.0760, lon2: 72.8777 },
      { origin: 'Singapore', destination: 'India', risk: 'medium', lat1: 1.3521, lon1: 103.8198, lat2: 13.0827, lon2: 80.2707 }
    ];
  }
};

export const getRiskHeatmap = async () => {
  try {
    const response = await api.get('/risk-heatmap');
    return response.data;
  } catch (error) {
    console.error('Error fetching risk heatmap:', error);
    return {
      China: 40,
      UAE: 30,
      Singapore: 20,
      'Hong Kong': 15,
      Malaysia: 10
    };
  }
};

export const askAI = async (question) => {
  try {
    const response = await api.post('/ai-explain', { question });
    return response.data;
  } catch (error) {
    console.error('Error asking AI:', error);
    return {
      answer: 'This container has been flagged as high risk due to multiple factors including weight mismatch, unusual value-to-weight ratio, and the exporter being previously flagged for suspicious activities.'
    };
  }
};

export const getRiskAlerts = async () => {
  try {
    const response = await api.get('/risk-alerts');
    return response.data;
  } catch (error) {
    console.error('Error fetching risk alerts:', error);
    return [
      {
        container_id: 'C7823',
        importer: 'ABC Imports',
        risk_score: 0.91,
        risk_level: 'CRITICAL',
        message: 'Severe weight mismatch detected'
      },
      {
        container_id: 'C5621',
        importer: 'Global Trade Co',
        risk_score: 0.87,
        risk_level: 'HIGH',
        message: 'Exporter flagged in previous shipments'
      }
    ];
  }
};

export default api;
