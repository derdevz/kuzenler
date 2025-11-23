"use client"

import { MapPin, Route } from "lucide-react"

const cargoData = [
  {
    id: "1",
    route: [
      { city: "İstanbul", lat: 41.0082, lng: 28.9784, status: "completed" },
      { city: "Bolu", lat: 40.7353, lng: 31.5926, status: "current" },
      { city: "Ankara", lat: 39.9334, lng: 32.8597, status: "pending" },
    ],
  },
  {
    id: "2",
    route: [
      { city: "İzmir", lat: 38.4161, lng: 27.1228, status: "completed" },
      { city: "Manisa", lat: 38.6191, lng: 27.4007, status: "current" },
      { city: "İstanbul", lat: 41.0082, lng: 28.9784, status: "pending" },
    ],
  },
  {
    id: "3",
    route: [
      { city: "Ankara", lat: 39.9334, lng: 32.8597, status: "completed" },
      { city: "İzmir", lat: 38.4161, lng: 27.1228, status: "completed" },
    ],
  },
]

interface CargoMapProps {
  cargoIndex: number
}

export default function CargoMap({ cargoIndex }: CargoMapProps) {
  const cargo = cargoData[cargoIndex]

  return (
    <div className="neon-border rounded-xl bg-slate-900/40 backdrop-blur-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Route className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Rota Haritası</h3>
      </div>

      {/* Simple Route Visualization */}
      <div className="space-y-4">
        {cargo.route.map((waypoint, index) => (
          <div key={index} className="flex items-center gap-4">
            {/* Location Pin */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  waypoint.status === "completed"
                    ? "bg-green-500 border-green-400"
                    : waypoint.status === "current"
                      ? "bg-purple-500 border-purple-300 animate-pulse shadow-lg shadow-purple-500/50"
                      : "bg-slate-700 border-slate-600"
                }`}
              >
                {waypoint.status === "current" && <div className="w-1 h-1 bg-white rounded-full" />}
              </div>

              {/* Connecting Line */}
              {index < cargo.route.length - 1 && (
                <div className="w-0.5 h-12 bg-gradient-to-b from-slate-600 to-slate-700 my-1" />
              )}
            </div>

            {/* Location Info */}
            <div className="flex-1">
              <div
                className={`p-3 rounded-lg ${
                  waypoint.status === "current"
                    ? "bg-purple-900/30 border border-purple-500/50"
                    : waypoint.status === "completed"
                      ? "bg-green-900/20 border border-green-500/30"
                      : "bg-slate-800/30 border border-slate-700/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span
                    className={`font-semibold ${
                      waypoint.status === "current"
                        ? "text-purple-400"
                        : waypoint.status === "completed"
                          ? "text-green-400"
                          : "text-slate-400"
                    }`}
                  >
                    {waypoint.city}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {waypoint.status === "completed" && "✓ Geçildi"}
                  {waypoint.status === "current" && "● Şu anda burada"}
                  {waypoint.status === "pending" && "⚬ Beklemede"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Distance Info */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/40 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Kalan Mesafe</p>
            <p className="text-lg font-bold text-purple-400">~{(Math.random() * 100 + 50) | 0} km</p>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Tahmini Süre</p>
            <p className="text-lg font-bold text-purple-400">~{(Math.random() * 4 + 1) | 0}h</p>
          </div>
        </div>
      </div>
    </div>
  )
}
