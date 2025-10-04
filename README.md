# AirWatch - Air Quality Monitoring & Forecasting

A full-stack web application for real-time air quality monitoring and AI-powered forecasting. Built with Next.js, React, MongoDB, and machine learning algorithms.


## Features

### 🗺️ Interactive Map
- Real-time air quality monitoring stations
- Color-coded markers based on pollution levels
- Interactive popups with detailed measurements
- Support for PM2.5, NO2, and O3 parameters

### 📊 Data Visualization
- Historical trends (7-day charts)
- 24-hour AI-powered forecasts
- Real-time Air Quality Index (AQI) display
- Current weather conditions

### 🚨 Alert System
- Automatic threshold monitoring
- Real-time notifications when air quality exceeds safe limits
- Alert history and filtering
- Configurable thresholds (PM2.5 > 100, NO2 > 40)

### 🤖 AI Forecasting
- Linear regression model with confidence intervals
- R² score and Mean Absolute Error metrics
- Model performance comparison
- 24-hour predictions with decreasing confidence

### 🌤️ Weather Integration
- Current temperature, humidity, and wind speed
- Weather conditions display
- Integration with OpenWeatherMap API

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4, Material-UI
- **Maps**: React Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: MongoDB Atlas
- **External APIs**: 
  - OpenAQ (Air Quality Data)
  - OpenWeatherMap (Weather Data)

### Machine Learning
- Linear Regression (implemented in TypeScript)
- R² Score and MAE metrics
- Confidence interval calculations

## Project Structure

\`\`\`
air-quality-app/
├── app/
│   ├── api/
│   │   ├── airquality/route.ts    # Fetch air quality data
│   │   ├── weather/route.ts       # Fetch weather data
│   │   ├── history/route.ts       # Historical data
│   │   ├── alerts/route.ts        # Alert management
│   │   └── forecast/route.ts      # AI forecasting
│   ├── page.tsx                   # Main dashboard
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/
│   ├── air-quality-map.tsx        # Map container
│   ├── map-component.tsx          # Leaflet map
│   ├── weather-card.tsx           # Weather display
│   ├── historical-chart.tsx       # Historical trends
│   ├── forecast-chart.tsx         # AI forecast chart
│   ├── aqi-summary.tsx            # AQI gauge
│   ├── alerts-panel.tsx           # Alert list
│   ├── alert-monitor.tsx          # Alert monitoring
│   ├── model-comparison.tsx       # ML model info
│   └── ui/                        # Reusable UI components
├── lib/
│   ├── mongodb.ts                 # Database connection
│   ├── alert-checker.ts           # Alert logic
│   ├── ml-forecast.ts             # ML utilities
│   └── utils.ts                   # Helper functions
├── scripts/
│   └── seed-alerts.ts             # Database seeding
└── package.json
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- OpenWeatherMap API key
- OpenAQ API access (free, no key required)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd air-quality-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   \`\`\`env
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/airquality?retryWrites=true&w=majority

   # OpenWeatherMap API
   OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
   \`\`\`

4. **Set up MongoDB**
   
   The application will automatically create the required collections:
   - `airquality_history` - Historical air quality data
   - `alerts` - Alert records

   Optionally, seed sample alerts:
   \`\`\`bash
   npx tsx scripts/seed-alerts.ts
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Documentation

### Air Quality Endpoint

**GET** `/api/airquality?city={cityName}`

Fetches current air quality data from OpenAQ API.

**Parameters:**
- `city` (required): City name

**Response:**
\`\`\`json
{
  "success": true,
  "city": "London",
  "data": [
    {
      "location": "Station Name",
      "city": "London",
      "country": "GB",
      "coordinates": {
        "latitude": 51.5074,
        "longitude": -0.1278
      },
      "measurements": [
        {
          "parameter": "pm25",
          "value": 35.5,
          "unit": "µg/m³",
          "lastUpdated": "2025-01-10T12:00:00Z"
        }
      ]
    }
  ]
}
\`\`\`

### Weather Endpoint

**GET** `/api/weather?city={cityName}`

Fetches current weather data from OpenWeatherMap.

**Parameters:**
- `city` (required): City name

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "city": "London",
    "country": "GB",
    "temperature": 15.5,
    "humidity": 65,
    "windSpeed": 3.5,
    "description": "partly cloudy"
  }
}
\`\`\`

### Historical Data Endpoint

**GET** `/api/history?city={cityName}&days={number}`

Retrieves historical air quality data.

**Parameters:**
- `city` (required): City name
- `days` (optional): Number of days (default: 7)

**Response:**
\`\`\`json
{
  "success": true,
  "city": "London",
  "data": [
    {
      "city": "London",
      "timestamp": "2025-01-03T00:00:00Z",
      "pm25": 35,
      "no2": 25,
      "o3": 45
    }
  ]
}
\`\`\`

### Alerts Endpoint

**GET** `/api/alerts?city={cityName}`

Retrieves alerts for a city.

**POST** `/api/alerts`

Creates a new alert.

**Request Body:**
\`\`\`json
{
  "city": "London",
  "parameter": "pm25",
  "value": 125,
  "threshold": 100,
  "message": "Unhealthy Air Quality - PM2.5 levels exceed safe limits"
}
\`\`\`

### Forecast Endpoint

**GET** `/api/forecast?city={cityName}&hours={number}`

Generates AI-powered air quality forecast.

**Parameters:**
- `city` (required): City name
- `hours` (optional): Forecast hours (default: 24)

**Response:**
\`\`\`json
{
  "success": true,
  "city": "London",
  "forecast": [
    {
      "timestamp": "2025-01-10T13:00:00Z",
      "hour": 1,
      "pm25": 38,
      "no2": 27,
      "o3": 48,
      "confidence": 85
    }
  ],
  "models": {
    "pm25": {
      "r2Score": 0.75,
      "mae": 5.2
    }
  },
  "accuracy": 75
}
\`\`\`

## Alert System

### Thresholds

The alert system monitors the following thresholds:

| Parameter | Threshold | Severity |
|-----------|-----------|----------|
| PM2.5 | > 100 µg/m³ | Unhealthy |
| PM2.5 | > 150 µg/m³ | Very Unhealthy |
| PM2.5 | > 250 µg/m³ | Hazardous |
| NO₂ | > 40 µg/m³ | Unhealthy |
| NO₂ | > 200 µg/m³ | Very Unhealthy |
| O₃ | > 200 µg/m³ | Unhealthy |
| O₃ | > 400 µg/m³ | Very Unhealthy |

### Alert Flow

1. Air quality data is fetched from OpenAQ
2. Each measurement is checked against thresholds
3. If exceeded, an alert is created and stored in MongoDB
4. Alerts are displayed in real-time on the dashboard
5. Console logs are generated for monitoring

## Machine Learning

### Current Implementation

The prototype uses **Linear Regression** for forecasting:

- **Algorithm**: Simple linear regression
- **Features**: Time-based index
- **Targets**: PM2.5, NO2, O3 levels
- **Metrics**: R² score, Mean Absolute Error (MAE)
- **Confidence**: Decreases with prediction distance

### Model Performance

Typical accuracy ranges:
- **Linear Regression**: 65-75%
- **Short-term (1-6 hours)**: Higher confidence
- **Long-term (12-24 hours)**: Lower confidence


