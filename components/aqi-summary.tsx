"use client"

import { useEffect, useState } from "react"
import { Paper, Box, Typography, CircularProgress } from "@mui/material"
import SpeedIcon from "@mui/icons-material/Speed"

interface AQISummaryProps {
  city: string
}

function getAQILevel(pm25: number): { level: string; color: string; description: string } {
  if (pm25 <= 12) return { level: "Good", color: "#66BB6A", description: "Air quality is satisfactory" }
  if (pm25 <= 35.4) return { level: "Moderate", color: "#FFA726", description: "Acceptable for most people" }
  if (pm25 <= 55.4)
    return {
      level: "Unhealthy for Sensitive Groups",
      color: "#FF9800",
      description: "Sensitive groups may experience effects",
    }
  if (pm25 <= 150.4) return { level: "Unhealthy", color: "#EF5350", description: "Everyone may experience effects" }
  if (pm25 <= 250.4)
    return {
      level: "Very Unhealthy",
      color: "#AB47BC",
      description: "Health alert: everyone may experience serious effects",
    }
  return { level: "Hazardous", color: "#8E24AA", description: "Health warning of emergency conditions" }
}

export function AQISummary({ city }: AQISummaryProps) {
  const [airQuality, setAirQuality] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAirQuality = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/airquality?city=${encodeURIComponent(city)}`)
        if (response.ok) {
          const data = await response.json()
          setAirQuality(data)
        }
      } catch (err) {
        console.error("[v0] Error fetching air quality:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAirQuality()
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

  // Calculate average PM2.5 from all stations
  const pm25Values =
    airQuality?.data
      ?.flatMap((station: any) => station.measurements?.filter((m: any) => m.parameter === "pm25") || [])
      .map((m: any) => m.value) || []

  const avgPM25 = pm25Values.length > 0 ? pm25Values.reduce((a: number, b: number) => a + b, 0) / pm25Values.length : 0

  const aqiInfo = getAQILevel(avgPM25)

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SpeedIcon sx={{ color: "primary.main" }} />
          <Typography variant="h6">Air Quality Index</Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 3 }}>
        <Box
          sx={{
            width: 128,
            height: 128,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: aqiInfo.color,
            mb: 2,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" color="white">
              {Math.round(avgPM25)}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)" }}>
              PM2.5
            </Typography>
          </Box>
        </Box>

        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
          {aqiInfo.level}
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {aqiInfo.description}
        </Typography>

        <Box sx={{ width: "100%", mt: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              PM2.5 Average
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {avgPM25.toFixed(1)} μg/m³
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Monitoring Stations
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {airQuality?.data?.length || 0}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}
