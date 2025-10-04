# Setup Guide

This guide will walk you through setting up the Air Quality Monitoring application from scratch.

## Step 1: Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`

- **npm** (comes with Node.js)
  - Verify: `npm --version`

- **Git** (optional, for cloning)
  - Download from [git-scm.com](https://git-scm.com/)

## Step 2: Get API Keys

### MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier is sufficient)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your database user password

Example connection string:
\`\`\`
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/airquality?retryWrites=true&w=majority
\`\`\`

### OpenWeatherMap API (Weather Data)

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to "API keys" in your account
4. Copy your API key (it may take a few minutes to activate)

Example API key:
\`\`\`
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
\`\`\`

## Step 3: Project Setup

### Option A: Download from v0

1. Click the three dots in the top right
2. Select "Download ZIP"
3. Extract the ZIP file
4. Open terminal in the extracted folder

### Option B: Clone from GitHub

\`\`\`bash
git clone <repository-url>
cd air-quality-app
\`\`\`

## Step 4: Install Dependencies

\`\`\`bash
npm install
\`\`\`

This will install all required packages including:
- Next.js
- React
- MongoDB driver
- Leaflet
- Recharts
- Material-UI
- And more...

## Step 5: Configure Environment Variables

1. Copy the example environment file:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. Open `.env.local` in a text editor

3. Add your MongoDB connection string:
   \`\`\`env
   MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/airquality?retryWrites=true&w=majority
   \`\`\`

4. Add your OpenWeatherMap API key:
   \`\`\`env
   OPENWEATHERMAP_API_KEY=your_actual_api_key_here
   \`\`\`

5. Save the file

## Step 6: Initialize Database (Optional)

To seed sample alerts for testing:

\`\`\`bash
npx tsx scripts/seed-alerts.ts
\`\`\`

This creates sample alerts in your MongoDB database.

## Step 7: Run the Application

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

You should see:
\`\`\`
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Ready in X.Xs
\`\`\`

## Step 8: Open the Application

1. Open your browser
2. Navigate to [http://localhost:3000](http://localhost:3000)
3. You should see the AirWatch dashboard

## Step 9: Test the Application

### Test Search Functionality
1. Enter a city name in the search bar (e.g., "London", "New York", "Tokyo")
2. Click the search button
3. The map and data should update

### Test Features
- **Map**: Should show air quality monitoring stations
- **Charts**: Historical trends and forecasts should display
- **Weather**: Current weather conditions should appear
- **Alerts**: Any active alerts should be visible

## Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution:**
1. Verify your MongoDB connection string is correct
2. Check that your IP is whitelisted in MongoDB Atlas:
   - Go to Network Access in MongoDB Atlas
   - Add your IP address or use `0.0.0.0/0` for testing
3. Ensure your database user has read/write permissions

### Issue: "Weather data unavailable"

**Solution:**
1. Verify your OpenWeatherMap API key is correct
2. Wait a few minutes if you just created the key (activation delay)
3. Check you haven't exceeded the free tier limit (60 calls/minute)

### Issue: "Map not loading"

**Solution:**
1. Check browser console for errors (F12)
2. Ensure you have a stable internet connection
3. Try refreshing the page
4. Clear browser cache

### Issue: "No air quality data"

**Solution:**
1. Try a different city name (some cities may not have monitoring stations)
2. Check the OpenAQ API status: [status.openaq.org](https://status.openaq.org)
3. The app will show sample data if real data is unavailable

### Issue: Port 3000 already in use

**Solution:**
\`\`\`bash
# Kill the process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port:
npm run dev -- -p 3001
\`\`\`

## Next Steps

### Customize the Application

1. **Change the default city**: Edit `app/page.tsx`, line with `useState("London")`
2. **Adjust alert thresholds**: Edit `lib/alert-checker.ts`
3. **Modify colors**: Edit `app/globals.css`
4. **Add more cities**: No changes needed, just search for any city

### Deploy to Production

See the main README.md for deployment instructions to Vercel.

## Getting Help

If you encounter issues:

1. Check the browser console (F12) for error messages
2. Check the terminal where `npm run dev` is running
3. Review the troubleshooting section above
4. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version)

## Success Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB Atlas account created
- [ ] OpenWeatherMap API key obtained
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Development server running (`npm run dev`)
- [ ] Application accessible at localhost:3000
- [ ] Search functionality working
- [ ] Map displaying correctly
- [ ] Charts showing data
- [ ] Weather information visible

Congratulations! Your Air Quality Monitoring application is now running.
