# API Documentation

Complete API reference for the Air Quality Monitoring application.

## Base URL

\`\`\`
http://localhost:3000/api
\`\`\`

## Endpoints

### 1. Air Quality Data

Fetch current air quality measurements from monitoring stations.

**Endpoint:** `GET /api/airquality`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| city | string | Yes | City name to query |

**Example Request:**

\`\`\`bash
curl "http://localhost:3000/api/airquality?city=London"
\`\`\`

**Example Response:**

\`\`\`json
{
  "success": true,
  "city": "London",
  "data": [
    {
      "location": "London Westminster",
      "city": "London",
      "country": "GB",
      "coordinates": {
        "latitude": 51.4975,
        "longitude": -0.1357
      },
      "measurements": [
        {
          "parameter": "pm25",
          "value": 35.5,
          "unit": "µg/m³",
          "lastUpdated": "2025-01-10T12:00:00Z"
        },
        {
          "parameter": "no2",
          "value": 28.3,
          "unit": "µg/m³",
          "lastUpdated": "2025-01-10T12:00:00Z"
        },
        {
          "parameter": "o3",
          "value": 45.2,
          "unit": "µg/m³",
          "lastUpdated": "2025-01-10T12:00:00Z"
        }
      ]
    }
  ],
  "timestamp": "2025-01-10T12:05:00Z"
}
\`\`\`

**Error Response:**

\`\`\`json
{
  "error": "City parameter is required"
}
\`\`\`

**Status Codes:**
- `200` - Success
- `400` - Bad request (missing city parameter)
- `500` - Server error

---

### 2. Weather Data

Fetch current weather conditions for a city.

**Endpoint:** `GET /api/weather`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| city | string | Yes | City name to query |

**Example Request:**

\`\`\`bash
curl "http://localhost:3000/api/weather?city=London"
\`\`\`

**Example Response:**

\`\`\`json
{
  "success": true,
  "data": {
    "city": "London",
    "country": "GB",
    "coordinates": {
      "lat": 51.5074,
      "lon": -0.1278
    },
    "temperature": 15.5,
    "feelsLike": 14.2,
    "humidity": 65,
    "pressure": 1013,
    "windSpeed": 3.5,
    "description": "partly cloudy",
    "icon": "02d",
    "timestamp": "2025-01-10T12:05:00Z"
  }
}
\`\`\`

**Status Codes:**
- `200` - Success
- `400` - Bad request
- `500` - Server error or API key not configured

---

### 3. Historical Data

Retrieve historical air quality measurements.

**Endpoint:** `GET /api/history`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| city | string | Yes | - | City name to query |
| days | number | No | 7 | Number of days of history |

**Example Request:**

\`\`\`bash
curl "http://localhost:3000/api/history?city=London&days=7"
\`\`\`

**Example Response:**

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
    },
    {
      "city": "London",
      "timestamp": "2025-01-04T00:00:00Z",
      "pm25": 42,
      "no2": 30,
      "o3": 48
    }
  ],
  "note": "Sample data - no historical data available"
}
\`\`\`

**Note:** If no historical data exists in the database, the API returns generated sample data for prototyping.

---

### 4. Alerts

Manage air quality alerts.

#### Get Alerts

**Endpoint:** `GET /api/alerts`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| city | string | No | Filter alerts by city |

**Example Request:**

\`\`\`bash
curl "http://localhost:3000/api/alerts?city=London"
\`\`\`

**Example Response:**

\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "city": "London",
      "parameter": "pm25",
      "value": 125,
      "threshold": 100,
      "message": "Unhealthy Air Quality - PM2.5 levels exceed safe limits",
      "severity": "unhealthy",
      "timestamp": "2025-01-10T10:30:00Z",
      "status": "active"
    }
  ]
}
\`\`\`

#### Create Alert

**Endpoint:** `POST /api/alerts`

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

**Example Response:**

\`\`\`json
{
  "success": true,
  "alertId": "507f1f77bcf86cd799439011",
  "alert": {
    "city": "London",
    "parameter": "pm25",
    "value": 125,
    "threshold": 100,
    "message": "Unhealthy Air Quality - PM2.5 levels exceed safe limits",
    "timestamp": "2025-01-10T12:05:00Z",
    "status": "active"
  }
}
\`\`\`

---

### 5. Forecast

Generate AI-powered air quality forecasts.

**Endpoint:** `GET /api/forecast`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| city | string | Yes | - | City name to query |
| hours | number | No | 24 | Forecast duration in hours |

**Example Request:**

\`\`\`bash
curl "http://localhost:3000/api/forecast?city=London&hours=24"
\`\`\`

**Example Response:**

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
    },
    {
      "timestamp": "2025-01-10T14:00:00Z",
      "hour": 2,
      "pm25": 39,
      "no2": 28,
      "o3": 49,
      "confidence": 82
    }
  ],
  "models": {
    "pm25": {
      "r2Score": 0.752,
      "mae": 5.23
    },
    "no2": {
      "r2Score": 0.681,
      "mae": 3.45
    },
    "o3": {
      "r2Score": 0.724,
      "mae": 4.12
    }
  },
  "accuracy": 72,
  "algorithm": "linear_regression",
  "note": "Enhanced linear regression model with confidence intervals"
}
\`\`\`

**Model Metrics:**
- `r2Score`: R² coefficient of determination (0-1, higher is better)
- `mae`: Mean Absolute Error (lower is better)
- `accuracy`: Overall model accuracy percentage
- `confidence`: Prediction confidence (decreases over time)

---

## Error Handling

All endpoints return consistent error responses:

\`\`\`json
{
  "error": "Error message description"
}
\`\`\`

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (missing or invalid parameters)
- `500` - Internal Server Error

## Rate Limits

### External APIs

- **OpenAQ**: No strict rate limits for reasonable use
- **OpenWeatherMap**: 60 calls/minute (free tier)

### Internal APIs

No rate limits currently implemented. For production, consider implementing rate limiting using middleware.

## Data Sources

- **Air Quality**: [OpenAQ API](https://docs.openaq.org/)
- **Weather**: [OpenWeatherMap API](https://openweathermap.org/api)
- **Historical Data**: MongoDB Atlas (stored locally)

## Authentication

Currently, no authentication is required. For production deployment, consider adding:
- API keys for external access
- JWT tokens for user sessions
- Rate limiting per user/IP

## CORS

CORS is enabled for all origins in development. For production, configure allowed origins in `next.config.mjs`.

## Webhooks

Not currently implemented. Future enhancement could include:
- Alert webhooks for external systems
- Data export webhooks
- Real-time data streaming

## SDK / Client Libraries

Currently, no official SDK is provided. The API can be accessed using:
- `fetch` API (JavaScript/TypeScript)
- `axios` (JavaScript/TypeScript)
- `requests` (Python)
- `curl` (Command line)

Example with fetch:

\`\`\`typescript
const response = await fetch('/api/airquality?city=London');
const data = await response.json();
console.log(data);
