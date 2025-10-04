import { type NextRequest, NextResponse } from "next/server"
import { generateEnhancedForecast } from "@/lip/ml-forecast"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get("city")
  const hours = Number.parseInt(searchParams.get("hours") || "24")

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
  }

  try {
    // Fetch historical data for the city
    const historyResponse = await fetch(
      `${request.nextUrl.origin}/api/history?city=${encodeURIComponent(city)}&days=7`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!historyResponse.ok) {
      throw new Error("Failed to fetch historical data")
    }

    const historyData = await historyResponse.json()
    const data = historyData.data

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Insufficient historical data for forecast" }, { status: 400 })
    }

    // Generate enhanced forecast with ML metrics
    const forecastResult = generateEnhancedForecast(data, hours)

    return NextResponse.json({
      success: true,
      city,
      forecast: forecastResult.predictions,
      models: {
        pm25: {
          r2Score: forecastResult.models.pm25.r2Score,
          mae: forecastResult.models.pm25.mae,
        },
        no2: {
          r2Score: forecastResult.models.no2.r2Score,
          mae: forecastResult.models.no2.mae,
        },
        o3: {
          r2Score: forecastResult.models.o3.r2Score,
          mae: forecastResult.models.o3.mae,
        },
      },
      accuracy: forecastResult.accuracy,
      algorithm: "linear_regression",
      note: "Enhanced linear regression model with confidence intervals",
    })
  } catch (error) {
    console.error("[v0] Error generating forecast:", error)
    return NextResponse.json({ error: "Failed to generate forecast" }, { status: 500 })
  }
}
