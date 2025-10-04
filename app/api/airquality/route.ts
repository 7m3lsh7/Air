import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get("city")

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
  }

  try {
    // Fetch data from OpenAQ API
    const response = await fetch(`https://api.openaq.org/v2/latest?city=${encodeURIComponent(city)}&limit=100`, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch air quality data")
    }

    const data = await response.json()

    // Process and structure the data
    const airQualityData =
      data.results?.map((station: any) => ({
        location: station.location,
        city: station.city,
        country: station.country,
        coordinates: station.coordinates,
        measurements: station.measurements?.map((m: any) => ({
          parameter: m.parameter,
          value: m.value,
          unit: m.unit,
          lastUpdated: m.lastUpdated,
        })),
      })) || []

    // Store in MongoDB (we'll implement this after setting up the connection)
    // await storeAirQualityData(airQualityData)

    return NextResponse.json({
      success: true,
      city,
      data: airQualityData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error fetching air quality data:", error)
    return NextResponse.json({ error: "Failed to fetch air quality data" }, { status: 500 })
  }
}
