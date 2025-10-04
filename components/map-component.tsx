"use client"

import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

interface MapComponentProps {
  data: any
}

function getAQIColor(parameter: string, value: number): string {
  if (parameter === "pm25") {
    if (value > 250) return "#8b1a1a"
    if (value > 150) return "#a83232"
    if (value > 100) return "#d97706"
    if (value > 55) return "#eab308"
    return "#22c55e"
  }

  if (parameter === "no2") {
    if (value > 400) return "#8b1a1a"
    if (value > 200) return "#a83232"
    if (value > 40) return "#d97706"
    return "#22c55e"
  }

  if (parameter === "o3") {
    if (value > 800) return "#8b1a1a"
    if (value > 400) return "#a83232"
    if (value > 200) return "#d97706"
    return "#22c55e"
  }

  return "#3b82f6"
}

export default function MapComponent({ data }: MapComponentProps) {
  const stations = data?.data || []

  // Default center (London)
  const defaultCenter: [number, number] = [51.5074, -0.1278]

  // Get center from first station with coordinates
  const center: [number, number] = stations.find((s: any) => s.coordinates?.latitude && s.coordinates?.longitude)
    ?.coordinates
    ? [
        stations.find((s: any) => s.coordinates?.latitude)?.coordinates?.latitude,
        stations.find((s: any) => s.coordinates?.longitude)?.coordinates?.longitude,
      ]
    : defaultCenter

  return (
    <MapContainer center={center} zoom={11} style={{ height: "500px", width: "100%", borderRadius: "0.5rem" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {stations.map((station: any, index: number) => {
        if (!station.coordinates?.latitude || !station.coordinates?.longitude) return null

        const position: [number, number] = [station.coordinates.latitude, station.coordinates.longitude]

        // Get PM2.5 value for color coding
        const pm25Measurement = station.measurements?.find((m: any) => m.parameter === "pm25")
        const pm25Value = pm25Measurement?.value || 0
        const color = getAQIColor("pm25", pm25Value)

        return (
          <CircleMarker
            key={index}
            center={position}
            radius={12}
            fillColor={color}
            color="#fff"
            weight={2}
            fillOpacity={0.8}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold mb-2">{station.location}</h3>
                <div className="space-y-1">
                  {station.measurements?.map((m: any, i: number) => (
                    <div key={i} className="flex justify-between gap-4">
                      <span className="font-medium">{m.parameter.toUpperCase()}:</span>
                      <span>
                        {m.value.toFixed(1)} {m.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
