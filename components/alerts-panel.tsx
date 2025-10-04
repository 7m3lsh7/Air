"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle, Loader2, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface AlertsPanelProps {
  city: string
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case "hazardous":
      return "bg-red-900/20 border-red-500"
    case "very_unhealthy":
      return "bg-red-800/20 border-red-600"
    case "unhealthy":
      return "bg-orange-800/20 border-orange-500"
    case "moderate":
      return "bg-yellow-800/20 border-yellow-500"
    default:
      return "bg-secondary border-border"
  }
}

export function AlertsPanel({ city }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "active">("active")

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/alerts?city=${encodeURIComponent(city)}`)
        if (response.ok) {
          const data = await response.json()
          setAlerts(data.data || [])
        }
      } catch (err) {
        console.error("[v0] Error fetching alerts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
    // Refresh alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [city])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  const filteredAlerts = filter === "active" ? alerts.filter((a) => a.status === "active") : alerts

  if (filteredAlerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-center">
        <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
        <p className="text-sm text-muted-foreground">No active alerts</p>
        <p className="text-xs text-muted-foreground">Air quality is within safe limits</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("active")}
          className="text-xs"
        >
          Active ({alerts.filter((a) => a.status === "active").length})
        </Button>
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className="text-xs"
        >
          All ({alerts.length})
        </Button>
      </div>

      {/* Alerts List */}
      {filteredAlerts.slice(0, 10).map((alert: any, index: number) => {
        const severityClass = getSeverityColor(alert.severity || "moderate")

        return (
          <div key={index} className={`p-3 rounded-lg border-l-4 ${severityClass}`}>
            <div className="flex items-start gap-3">
              {alert.status === "active" ? (
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant="destructive" className="text-xs">
                    {alert.parameter?.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-foreground mb-1">{alert.message}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    Value: <span className="text-foreground font-medium">{alert.value}</span>
                  </span>
                  <span>
                    Threshold: <span className="text-foreground font-medium">{alert.threshold}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
