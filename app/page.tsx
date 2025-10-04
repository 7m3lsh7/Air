"use client"

import type React from "react"
import { useState } from "react"
import { Box, Container, Grid, Paper, Typography, TextField, IconButton, AppBar, Toolbar } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AirIcon from "@mui/icons-material/Air"
import { AirQualityMap } from "@/components/air-quality-map"
import { WeatherCard } from "@/components/weather-card"
import { AlertsPanel } from "@/components/alerts-panel"
import { HistoricalChart } from "@/components/historical-chart"
import { ForecastChart } from "@/components/forecast-chart"
import { AQISummary } from "@/components/aqi-summary"
import { AlertMonitor } from "@/components/alert-monitor"
import { ModelComparison } from "@/components/model-comparison"

export default function HomePage() {
  const [city, setCity] = useState("London")
  const [searchInput, setSearchInput] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setCity(searchInput.trim())
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
            <AirIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Box>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: "text.primary" }}>
                AirWatch
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Air Quality Monitoring & Forecasting
              </Typography>
            </Box>
          </Box>

          <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 1, maxWidth: 400, width: "100%" }}>
            <TextField
              size="small"
              placeholder="Search city..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              fullWidth
              sx={{ bgcolor: "secondary.main" }}
            />
            <IconButton
              type="submit"
              color="primary"
              sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
            >
              <SearchIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column - Map and Charts */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Current City Info */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ color: "text.primary", mb: 0.5 }}>
                  Current Location
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {city}
                </Typography>
              </Paper>

              <AirQualityMap city={city} />
              <HistoricalChart city={city} />
              <ForecastChart city={city} />
              <ModelComparison />
              <WeatherCard city={city} />
            </Box>
          </Grid>

          {/* Right Column - AQI Summary and Alerts */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <AQISummary city={city} />
              <AlertMonitor city={city} />

              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ color: "text.primary", mb: 0.5 }}>
                  Alert History
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                  Recent air quality warnings
                </Typography>
                <AlertsPanel city={city} />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
