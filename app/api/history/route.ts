import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lip/mongodb"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get("city")
  const days = Number.parseInt(searchParams.get("days") || "7")

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
  }

  try {
    const { db } = await connectToDatabase()

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Query historical data from MongoDB
    const historicalData = await db
      .collection("airquality_history")
      .find({
        city: { $regex: new RegExp(city, "i") },
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ timestamp: 1 })
      .toArray()

    // If no data in DB, generate sample data for prototype
    if (historicalData.length === 0) {
      const sampleData = generateSampleHistoricalData(city, days)
      return NextResponse.json({
        success: true,
        city,
        data: sampleData,
        note: "Sample data - no historical data available",
      })
    }

    return NextResponse.json({
      success: true,
      city,
      data: historicalData,
    })
  } catch (error) {
    console.error("[v0] Error fetching historical data:", error)

    // Fallback to sample data if DB connection fails
    const sampleData = generateSampleHistoricalData(city, days)
    return NextResponse.json({
      success: true,
      city,
      data: sampleData,
      note: "Sample data - database unavailable",
    })
  }
}

function generateSampleHistoricalData(city: string, days: number) {
  const data = []
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Generate realistic sample values with some variation
    const basePM25 = 35 + Math.random() * 40
    const baseNO2 = 20 + Math.random() * 25
    const baseO3 = 40 + Math.random() * 30

    data.push({
      city,
      timestamp: date.toISOString(),
      pm25: Math.round(basePM25 + Math.sin(i / 2) * 15),
      no2: Math.round(baseNO2 + Math.cos(i / 3) * 10),
      o3: Math.round(baseO3 + Math.sin(i / 4) * 12),
    })
  }

  return data
}
