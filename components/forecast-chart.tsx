"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Activity, Loader2, TrendingUp, Brain } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ForecastChartProps {
  city: string
}

export function ForecastChart({ city }: ForecastChartProps) {
  const [data, setData] = useState<any[]>([])
  const [modelMetrics, setModelMetrics] = useState<any>(null)
  const [accuracy, setAccuracy] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`)
        if (response.ok) {
          const result = await response.json()
          // Format data for chart - show every 3 hours for readability
          const formattedData = result.forecast
            .filter((_: any, index: number) => index % 3 === 0)
            .map((item: any) => ({
              time: `${item.hour}h`,
              PM25: item.pm25,
              NO2: item.no2,
              O3: item.o3,
              confidence: item.confidence,
            }))
          setData(formattedData)
          setModelMetrics(result.models)
          setAccuracy(result.accuracy)
        }
      } catch (err) {
        console.error("[v0] Error fetching forecast:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchForecast()
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              24-Hour AI Forecast
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Predicted air quality levels with confidence intervals
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Brain className="h-3 w-3" />
              ML Model
            </Badge>
            <Badge variant={accuracy >= 70 ? "default" : "destructive"} className="text-xs flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {accuracy}% Accuracy
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPM25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.65 0.18 240)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="oklch(0.65 0.18 240)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNO2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.75 0.15 85)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="oklch(0.75 0.15 85)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorO3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.6 0.2 25)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="oklch(0.6 0.2 25)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 240)" />
            <XAxis dataKey="time" stroke="oklch(0.6 0.01 240)" style={{ fontSize: "12px" }} />
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
            <Area
              type="monotone"
              dataKey="PM25"
              stroke="oklch(0.65 0.18 240)"
              fillOpacity={1}
              fill="url(#colorPM25)"
              name="PM2.5"
            />
            <Area
              type="monotone"
              dataKey="NO2"
              stroke="oklch(0.75 0.15 85)"
              fillOpacity={1}
              fill="url(#colorNO2)"
              name="NO₂"
            />
            <Area
              type="monotone"
              dataKey="O3"
              stroke="oklch(0.6 0.2 25)"
              fillOpacity={1}
              fill="url(#colorO3)"
              name="O₃"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Model Performance Metrics */}
        {modelMetrics && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">PM2.5 Model</p>
              <p className="text-sm font-medium text-foreground">R² = {modelMetrics.pm25.r2Score.toFixed(3)}</p>
              <p className="text-xs text-muted-foreground">MAE: {modelMetrics.pm25.mae.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">NO₂ Model</p>
              <p className="text-sm font-medium text-foreground">R² = {modelMetrics.no2.r2Score.toFixed(3)}</p>
              <p className="text-xs text-muted-foreground">MAE: {modelMetrics.no2.mae.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">O₃ Model</p>
              <p className="text-sm font-medium text-foreground">R² = {modelMetrics.o3.r2Score.toFixed(3)}</p>
              <p className="text-xs text-muted-foreground">MAE: {modelMetrics.o3.mae.toFixed(2)}</p>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-secondary rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Model Info:</strong> This forecast uses linear regression with R² score
            and Mean Absolute Error (MAE) metrics. Confidence decreases for predictions further in the future. For
            production, consider LSTM, ARIMA, or ensemble methods trained on larger datasets.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
