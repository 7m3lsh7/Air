"use client"

import { useEffect, useState } from "react"
import { Paper, Box, Typography, Grid, CircularProgress } from "@mui/material"
import CloudIcon from "@mui/icons-material/Cloud"
import OpacityIcon from "@mui/icons-material/Opacity"
import AirIcon from "@mui/icons-material/Air"
import ThermostatIcon from "@mui/icons-material/Thermostat"

interface WeatherCardProps {
  city: string
}

export function WeatherCard({ city }: WeatherCardProps) {
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
        if (response.ok) {
          const data = await response.json()
          setWeather(data.data)
        }
      } catch (err) {
        console.error("[v0] Error fetching weather:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [city])

  if (loading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 192 }}>
          <CircularProgress />
        </Box>
      </Paper>
    )
  }

  if (!weather) {
    return (
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 192 }}>
          <Typography color="text.secondary">Weather data unavailable</Typography>
        </Box>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <CloudIcon sx={{ color: "primary.main" }} />
          <Typography variant="h6">Current Weather</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {weather.city}, {weather.country}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
              bgcolor: "secondary.main",
              borderRadius: 2,
            }}
          >
            <ThermostatIcon sx={{ color: "primary.main", mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {weather.temperature?.toFixed(1)}°C
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Temperature
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6} md={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
              bgcolor: "secondary.main",
              borderRadius: 2,
            }}
          >
            <OpacityIcon sx={{ color: "primary.main", mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {weather.humidity}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Humidity
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6} md={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
              bgcolor: "secondary.main",
              borderRadius: 2,
            }}
          >
            <AirIcon sx={{ color: "primary.main", mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {weather.windSpeed?.toFixed(1)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Wind (m/s)
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6} md={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
              bgcolor: "secondary.main",
              borderRadius: 2,
            }}
          >
            <CloudIcon sx={{ color: "primary.main", mb: 1 }} />
            <Typography variant="body2" fontWeight="medium" sx={{ textTransform: "capitalize" }}>
              {weather.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Conditions
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}
