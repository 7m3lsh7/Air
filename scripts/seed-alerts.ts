// Script to seed sample alerts for testing
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"

async function seedAlerts() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db("airquality")
    const alertsCollection = db.collection("alerts")

    // Clear existing alerts
    await alertsCollection.deleteMany({})

    // Sample alerts for different cities
    const sampleAlerts = [
      {
        city: "London",
        parameter: "pm25",
        value: 125,
        threshold: 100,
        message: "Unhealthy Air Quality - PM2.5 levels exceed safe limits",
        severity: "unhealthy",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: "active",
      },
      {
        city: "London",
        parameter: "no2",
        value: 55,
        threshold: 40,
        message: "Unhealthy Air Quality - NO2 levels exceed safe limits",
        severity: "unhealthy",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        status: "active",
      },
      {
        city: "New York",
        parameter: "pm25",
        value: 180,
        threshold: 150,
        message: "Very Unhealthy Air Quality - PM2.5 levels are very high",
        severity: "very_unhealthy",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        status: "active",
      },
      {
        city: "Los Angeles",
        parameter: "o3",
        value: 220,
        threshold: 200,
        message: "Unhealthy Air Quality - Ozone levels exceed safe limits",
        severity: "unhealthy",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        status: "active",
      },
    ]

    await alertsCollection.insertMany(sampleAlerts)

    console.log(`✓ Seeded ${sampleAlerts.length} sample alerts`)
  } catch (error) {
    console.error("Error seeding alerts:", error)
  } finally {
    await client.close()
  }
}

seedAlerts()
