export interface AirQualityMeasurement {
  parameter: string
  value: number
  unit: string
}

export interface AlertResult {
  triggered: boolean
  alerts: Array<{
    parameter: string
    value: number
    threshold: number
    message: string
    severity: "moderate" | "unhealthy" | "very_unhealthy" | "hazardous"
  }>
}

export function checkAirQualityAlerts(measurements: AirQualityMeasurement[]): AlertResult {
  const alerts: AlertResult["alerts"] = []

  measurements.forEach((measurement) => {
    const { parameter, value } = measurement

    // PM2.5 thresholds (μg/m³)
    if (parameter === "pm25") {
      if (value > 250) {
        alerts.push({
          parameter,
          value,
          threshold: 250,
          message: "Hazardous Air Quality - PM2.5 levels are extremely high",
          severity: "hazardous",
        })
      } else if (value > 150) {
        alerts.push({
          parameter,
          value,
          threshold: 150,
          message: "Very Unhealthy Air Quality - PM2.5 levels are very high",
          severity: "very_unhealthy",
        })
      } else if (value > 100) {
        alerts.push({
          parameter,
          value,
          threshold: 100,
          message: "Unhealthy Air Quality - PM2.5 levels exceed safe limits",
          severity: "unhealthy",
        })
      } else if (value > 55) {
        alerts.push({
          parameter,
          value,
          threshold: 55,
          message: "Moderate Air Quality - Sensitive groups should limit outdoor exposure",
          severity: "moderate",
        })
      }
    }

    // NO2 thresholds (μg/m³)
    if (parameter === "no2") {
      if (value > 400) {
        alerts.push({
          parameter,
          value,
          threshold: 400,
          message: "Hazardous Air Quality - NO2 levels are extremely high",
          severity: "hazardous",
        })
      } else if (value > 200) {
        alerts.push({
          parameter,
          value,
          threshold: 200,
          message: "Very Unhealthy Air Quality - NO2 levels are very high",
          severity: "very_unhealthy",
        })
      } else if (value > 40) {
        alerts.push({
          parameter,
          value,
          threshold: 40,
          message: "Unhealthy Air Quality - NO2 levels exceed safe limits",
          severity: "unhealthy",
        })
      }
    }

    // O3 thresholds (μg/m³)
    if (parameter === "o3") {
      if (value > 800) {
        alerts.push({
          parameter,
          value,
          threshold: 800,
          message: "Hazardous Air Quality - Ozone levels are extremely high",
          severity: "hazardous",
        })
      } else if (value > 400) {
        alerts.push({
          parameter,
          value,
          threshold: 400,
          message: "Very Unhealthy Air Quality - Ozone levels are very high",
          severity: "very_unhealthy",
        })
      } else if (value > 200) {
        alerts.push({
          parameter,
          value,
          threshold: 200,
          message: "Unhealthy Air Quality - Ozone levels exceed safe limits",
          severity: "unhealthy",
        })
      }
    }
  })

  return {
    triggered: alerts.length > 0,
    alerts,
  }
}

export async function storeAlert(city: string, alert: AlertResult["alerts"][0]): Promise<void> {
  try {
    await fetch("/api/alerts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city,
        parameter: alert.parameter,
        value: alert.value,
        threshold: alert.threshold,
        message: alert.message,
      }),
    })
  } catch (error) {
    console.error("[v0] Failed to store alert:", error)
  }
}
