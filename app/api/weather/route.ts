import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get("city")

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
  }

  const apiKey = process.env.OPENWEATHERMAP_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "OpenWeatherMap API key not configured" }, { status: 500 })
  }

  try {
    // Fetch current weather data
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const data = await response.json()

    const weatherData = {
      city: data.name,
      country: data.sys?.country,
      coordinates: {
        lat: data.coord?.lat,
        lon: data.coord?.lon,
      },
      temperature: data.main?.temp,
      feelsLike: data.main?.feels_like,
      humidity: data.main?.humidity,
      pressure: data.main?.pressure,
      windSpeed: data.wind?.speed,
      description: data.weather?.[0]?.description,
      icon: data.weather?.[0]?.icon,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: weatherData,
    })
  } catch (error) {
    console.error("[v0] Error fetching weather data:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
