"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, BellOff, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface AlertMonitorProps {
  city: string
}

export function AlertMonitor({ city }: AlertMonitorProps) {
  const [recentAlerts, setRecentAlerts] = useState<any[]>([])
  const [alertCount, setAlertCount] = useState(0)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`/api/alerts?city=${encodeURIComponent(city)}`)
        if (response.ok) {
          const data = await response.json()
          const alerts = data.data || []
          setRecentAlerts(alerts.slice(0, 3))
          setAlertCount(alerts.length)
        }
      } catch (err) {
        console.error("[v0] Error fetching alerts:", err)
      }
    }

    fetchAlerts()
    // Poll for new alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000)

    return () => clearInterval(interval)
  }, [city])

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Alert Monitor
            </CardTitle>
            <CardDescription className="text-muted-foreground">Real-time air quality notifications</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className="text-muted-foreground hover:text-foreground"
          >
            {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Alert Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total Alerts</p>
              <p className="text-2xl font-bold text-foreground">{alertCount}</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <Badge variant={alertCount > 0 ? "destructive" : "secondary"} className="mt-1">
                {alertCount > 0 ? "Active" : "Clear"}
              </Badge>
            </div>
          </div>

          {/* Recent Alerts */}
          {recentAlerts.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Recent Alerts</p>
              {recentAlerts.map((alert: any, index: number) => (
                <div key={index} className="p-2 bg-secondary rounded border-l-4 border-destructive">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{alert.parameter?.toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Alert Thresholds Info */}
          <div className="mt-4 p-3 bg-secondary rounded-lg">
            <p className="text-xs font-medium text-foreground mb-2">Alert Thresholds</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>PM2.5:</span>
                <span className="text-foreground">{">"} 100 μg/m³</span>
              </div>
              <div className="flex justify-between">
                <span>NO₂:</span>
                <span className="text-foreground">{">"} 40 μg/m³</span>
              </div>
              <div className="flex justify-between">
                <span>O₃:</span>
                <span className="text-foreground">{">"} 200 μg/m³</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
