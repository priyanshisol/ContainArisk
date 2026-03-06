# SmartContainer Risk Engine - Quick Start

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd smartcontainer-frontend
npm install --legacy-peer-deps
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

### 3. Build for Production
```bash
npm run build
```

## 📋 Backend API Setup

The frontend expects a backend API at `http://localhost:8000`

If your backend runs on a different URL, update `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'YOUR_BACKEND_URL',
  // ...
});
```

## 🎯 Features

✅ Real-time Dashboard with KPIs  
✅ Risk Distribution Charts  
✅ High-Risk Container Table  
✅ CSV File Upload (Drag & Drop)  
✅ Container Details View  
✅ Country & Importer Risk Insights  
✅ Global Trade Route Map  
✅ AI Chat Assistant  
✅ Risk Alert Notifications  
✅ Dark/Light Theme Toggle  
✅ Responsive Design  

## 🔌 API Endpoints Required

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/summary` | GET | Dashboard stats |
| `/risk-distribution` | GET | Risk levels |
| `/high-risk-containers` | GET | Container list |
| `/upload-containers` | POST | Upload CSV |
| `/container/{id}` | GET | Container details |
| `/country-risk` | GET | Country analytics |
| `/importer-risk` | GET | Importer analytics |
| `/trade-routes` | GET | Trade routes |
| `/risk-heatmap` | GET | Heatmap data |
| `/ai-explain` | POST | AI explanations |
| `/risk-alerts` | GET | Alert notifications |

## 💡 Demo Mode

The app includes fallback mock data. If the backend is unavailable, it will automatically use demo data for all features.

## 🎨 Theme

Toggle between dark and light mode using the button in the navbar.

## 📱 Navigation

- **Dashboard** - Overview and KPIs
- **Upload Data** - CSV file upload
- **Insights** - Analytics and charts
- **Trade Intelligence** - Global map view

## 🤖 AI Assistant

Click the floating chat button (bottom-right) to ask questions about container risks.

## 🔔 Alerts

Click the bell icon (top-right) to view risk alerts.

## 📊 CSV Upload Format

Required columns:
- Container ID
- Importer Name
- Exporter Name
- Origin Country
- Destination Country
- Weight (kg)
- Declared Value (USD)
- HS Code

## 🛠️ Tech Stack

- React + Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- Framer Motion
- Lucide React
- React Leaflet

## ⚡ Performance

- Fast refresh with Vite
- Optimized animations
- Lazy loading
- Code splitting

Enjoy building with SmartContainer Risk Engine! 🎉
