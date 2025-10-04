"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, Loader2 } from "lucide-react"

interface HistoricalChartProps {
  city: string
}

export function HistoricalChart({ city }: HistoricalChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/history?city=${encodeURIComponent(city)}&days=7`)
        if (response.ok) {
          const result = await response.json()
          // Format data for chart
          const formattedData = result.data.map((item: any) => ({
            date: new Date(item.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            PM25: item.pm25,
            NO2: item.no2,
            O3: item.o3,
          }))
          setData(formattedData)
        }
      } catch (err) {
        console.error("[v0] Error fetching historical data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [city])

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Historical Air Quality Trends
        </CardTitle>
        <CardDescription className="text-muted-foreground">Last 7 days of air quality measurements</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 240)" />
            <XAxis dataKey="date" stroke="oklch(0.6 0.01 240)" style={{ fontSize: "12px" }} />
            <YAxis
              stroke="oklch(0.6 0.01 240)"
              style={{ fontSize: "12px" }}
              label={{ value: "μg/m³", angle: -90, position: "insideLeft", style: { fill: "oklch(0.6 0.01 240)" } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.16 0.01 240)",
                border: "1px solid oklch(0.25 0.01 240)",
                borderRadius: "0.5rem",
                color: "oklch(0.95 0.01 240)",
              }}
            />
            <Legend wrapperStyle={{ color: "oklch(0.95 0.01 240)" }} />
            <Line
              type="monotone"
              dataKey="PM25"
              stroke="oklch(0.65 0.18 240)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="PM2.5"
            />
            <Line
              type="monotone"
              dataKey="NO2"
              stroke="oklch(0.75 0.15 85)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="NO₂"
            />
            <Line
              type="monotone"
              dataKey="O3"
              stroke="oklch(0.6 0.2 25)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="O₃"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Legend with AQI thresholds */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="p-3 bg-secondary rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">PM2.5 Threshold</p>
            <p className="text-sm font-medium text-foreground">100 μg/m³</p>
            <p className="text-xs text-muted-foreground">Unhealthy</p>
          </div>
          <div className="p-3 bg-secondary rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">NO₂ Threshold</p>
            <p className="text-sm font-medium text-foreground">40 μg/m³</p>
            <p className="text-xs text-muted-foreground">Unhealthy</p>
          </div>
          <div className="p-3 bg-secondary rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">O₃ Threshold</p>
            <p className="text-sm font-medium text-foreground">200 μg/m³</p>
            <p className="text-xs text-muted-foreground">Unhealthy</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
