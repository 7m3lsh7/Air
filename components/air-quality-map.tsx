"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { CircularProgress, Box, Paper, Typography } from "@mui/material"
import { checkAirQualityAlerts, storeAlert } from "@/lip/alert-checker"

const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <Paper sx={{ height: 500, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "secondary.main", borderRadius: 2 }}>
      <CircularProgress color="primary" />
    </Paper>
  ),
})

interface AirQualityMapProps { city: string }

export function AirQualityMap({ city }: AirQualityMapProps) {
  const [airQualityData, setAirQualityData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAirQuality = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/airquality?city=${encodeURIComponent(city)}`)
        if (!response.ok) throw new Error("Failed to fetch air quality data")
        const data = await response.json()
        setAirQualityData(data)

        if (data.data?.length > 0) {
          for (const station of data.data) {
            if (station.measurements?.length > 0) {
              const alertResult = checkAirQualityAlerts(station.measurements)
              if (alertResult.triggered) {
                for (const alert of alertResult.alerts) {
                  await storeAlert(city, alert)
                  console.log(`[v0] Alert for ${city}:`, alert.message)
                }
              }
            }
          }
        }
      } catch (err) {
        console.error(err)
        setError("Unable to load air quality data")
      } finally { setLoading(false) }
    }
    fetchAirQuality()
  }, [city])

  if (loading) {
    return (
      <Paper sx={{ height: 500, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "secondary.main", borderRadius: 2 }}>
        <CircularProgress color="primary" />
      </Paper>
    )
  }

  if (error) {
    return (
      <Paper sx={{ height: 500, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "secondary.main", borderRadius: 2 }}>
        <Typography color="text.secondary">{error}</Typography>
      </Paper>
    )
  }

  return <MapComponent data={airQualityData} />
}
