import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lip/mongodb"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get("city")

  try {
    const { db } = await connectToDatabase()

    const query = city ? { city: { $regex: new RegExp(city, "i") } } : {}

    const alerts = await db.collection("alerts").find(query).sort({ timestamp: -1 }).limit(50).toArray()

    return NextResponse.json({
      success: true,
      data: alerts,
    })
  } catch (error) {
    console.error("[v0] Error fetching alerts:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { city, parameter, value, threshold, message } = body

    if (!city || !parameter || value === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const alert = {
      city,
      parameter,
      value,
      threshold,
      message,
      timestamp: new Date(),
      status: "active",
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("alerts").insertOne(alert)

    console.log(`[v0] Alert triggered for ${city}: ${message}`)

    return NextResponse.json({
      success: true,
      alertId: result.insertedId,
      alert,
    })
  } catch (error) {
    console.error("[v0] Error creating alert:", error)
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
  }
}
