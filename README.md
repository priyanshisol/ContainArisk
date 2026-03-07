# SmartContainer Risk Engine - Frontend

An advanced analytics frontend for detecting high-risk shipping containers using machine learning and AI.

## Features

- 📊 **Real-time Dashboard** - Live KPI metrics with animated counters
- 🎯 **Risk Analytics** - Interactive charts and visualizations
- 🗺️ **Trade Intelligence** - Global trade route mapping with risk indicators
- 🤖 **AI Assistant** - Intelligent chatbot for risk explanations
- 🔔 **Risk Alerts** - Real-time notification system
- 📤 **Data Upload** - Drag-and-drop CSV file upload
- 🌓 **Dark/Light Mode** - Theme toggle for user preference
- 📱 **Responsive Design** - Works on all screen sizes

## Tech Stack

- **React** (Vite) - Fast, modern React framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Recharts** - Data visualization library
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **React Leaflet** - Interactive maps

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Navigate to the project directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Backend API Configuration

The frontend expects a backend API running at `http://localhost:8000`. 

### API Endpoints

The application connects to the following endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/summary` | GET | Dashboard summary statistics |
| `/risk-distribution` | GET | Risk level distribution data |
| `/high-risk-containers` | GET | List of high-risk containers |
| `/upload-containers` | POST | Upload CSV file with container data |
| `/container/{id}` | GET | Detailed container information |
| `/country-risk` | GET | Risk statistics by country |
| `/importer-risk` | GET | Risk statistics by importer |
| `/trade-routes` | GET | Global trade route data |
| `/risk-heatmap` | GET | Risk heatmap data by country |
| `/ai-explain` | POST | AI-powered risk explanations |
| `/risk-alerts` | GET | Real-time risk alerts |

### Changing the API Base URL

To connect to a different backend URL, edit `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'YOUR_BACKEND_URL_HERE',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Mock Data

The application includes fallback mock data for all endpoints. If the backend is unavailable, the app will display demo data automatically.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── StatCard.jsx
│   ├── RiskPieChart.jsx
│   ├── RiskHeatmap.jsx
│   ├── TradeRouteMap.jsx
│   ├── UploadCard.jsx
│   ├── ContainerTable.jsx
│   ├── RiskBadge.jsx
│   ├── LoadingSpinner.jsx
│   ├── AIChatPanel.jsx
│   ├── RiskAlertPanel.jsx
│   └── RiskNotification.jsx
├── pages/              # Page components
│   ├── Dashboard.jsx
│   ├── UploadPage.jsx
│   ├── ContainerDetails.jsx
│   ├── Insights.jsx
│   └── Intelligence.jsx
├── services/           # API service layer
│   └── api.js
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Features Guide

### Dashboard
- View total containers, high-risk containers, and anomalies
- Interactive pie chart showing risk distribution
- Searchable and filterable high-risk container table
- Click any row to view detailed container information

### Upload Data
- Drag-and-drop CSV file upload
- Real-time upload progress indicator
- Automatic redirect to dashboard after successful upload

### Container Details
- Comprehensive shipment information
- Visual risk score gauge
- Detailed risk factor explanations
- Easy navigation back to dashboard

### Insights
- Risk heatmap by country
- Bar charts for country and importer risk analysis
- Top risky importers leaderboard

### Trade Intelligence
- Interactive global map with trade routes
- Color-coded routes based on risk level
- Statistics on active routes and monitored countries

### AI Chat Assistant
- Floating chat button for easy access
- Ask questions about container risks
- Get AI-powered explanations
- Chat history maintained during session

### Risk Alerts
- Bell icon notification in navbar
- Slide-out panel with latest alerts
- Click alert to view container details
- Color-coded by risk level

## CSV Upload Format

When uploading container data, ensure your CSV includes these columns:

- Container ID
- Importer Name
- Exporter Name
- Origin Country
- Destination Country
- Weight (kg)
- Declared Value (USD)
- HS Code

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Deployment

The built application can be deployed to any static hosting service:

- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Connection Issues

If you see "Error fetching..." messages in the console:
1. Verify the backend is running at `http://localhost:8000`
2. Check CORS settings on the backend
3. The app will use mock data as fallback

### Map Not Displaying

If the trade route map doesn't load:
1. Check browser console for errors
2. Ensure `leaflet` CSS is properly imported
3. Verify internet connection (map tiles require external resources)

## License

MIT License

## Support

For issues or questions, please contact the development team.
