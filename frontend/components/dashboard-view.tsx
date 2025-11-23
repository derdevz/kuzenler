"use client"

import { useState } from "react"
import CargoTracker from "@/components/cargo-tracker"
import CargoMap from "@/components/cargo-map"
import TrackingTimeline from "@/components/tracking-timeline"
import { useLanguage } from "@/context/language-context"

interface DashboardViewProps {
  walletAddress: string
  onDisconnect: () => void
}

export default function DashboardView({ walletAddress, onDisconnect }: DashboardViewProps) {
  const { t } = useLanguage()
  const [selectedCargo, setSelectedCargo] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Cargo Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{t("cargo.tracking")}</h1>
          <p className="text-slate-400">{t("cargo.tracking")}</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Cargo List and Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cargo Tracker Cards */}
            <CargoTracker selectedIndex={selectedCargo} onSelectCargo={setSelectedCargo} />

            {/* Interactive Map */}
            <CargoMap cargoIndex={selectedCargo} />
          </div>

          {/* Right Column - Timeline and Status */}
          <div className="space-y-6">
            <TrackingTimeline cargoIndex={selectedCargo} />
          </div>
        </div>
      </main>
    </div>
  )
}
