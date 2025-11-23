"use client"

import { useState } from "react"
import { MapPin, Package, CheckCircle2, Clock, Edit2, Save, X } from "lucide-react"
import { dataStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/context/language-context"

interface CargoTrackerProps {
  customerId: string
}

export default function CargoTracker({ customerId }: CargoTrackerProps) {
  const { t } = useLanguage()
  const [shipments, setShipments] = useState(dataStore.getShipmentsByCustomer(customerId))
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ currentCity: string; status: string }>({
    currentCity: "",
    status: "pending",
  })

  const handleEditClick = (shipmentId: string) => {
    const shipment = shipments.find((s) => s.id === shipmentId)
    if (shipment && shipment.currentLocation.status !== "delivered") {
      setEditingId(shipmentId)
      setEditData({
        currentCity: shipment.currentLocation.city,
        status: shipment.currentLocation.status,
      })
    }
  }

  const handleSaveStatus = (shipmentId: string) => {
    const updated = dataStore.updateShipmentStatus(shipmentId, {
      city: editData.currentCity,
      country: "Türkiye",
      timestamp: new Date(),
      status: editData.status as "pending" | "in_transit" | "delivered" | "delayed",
    })

    if (updated) {
      setShipments(shipments.map((s) => (s.id === shipmentId ? updated : s)))
      setEditingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
      case "in_transit":
        return "bg-blue-500/20 border-blue-500/50 text-blue-400"
      case "delivered":
        return "bg-green-500/20 border-green-500/50 text-green-400"
      default:
        return "bg-slate-500/20 border-slate-500/50 text-slate-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "in_transit":
        return <Package className="w-4 h-4" />
      case "delivered":
        return <CheckCircle2 className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">{t("cargo.tracking")}</h2>

      {shipments.length === 0 ? (
        <div className="border border-purple-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur p-8 text-center rounded-lg">
          <p className="text-purple-300/70">{t("cargo.noRecords")}</p>
        </div>
      ) : (
        shipments.map((shipment) => {
          const isDelivered = shipment.currentLocation.status === "delivered"
          const isEditing = editingId === shipment.id

          return (
            <div
              key={shipment.id}
              className="border border-purple-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur rounded-lg p-6 transition-all hover:border-purple-400/50"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{shipment.trackingNumber}</h3>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        shipment.currentLocation.status,
                      )}`}
                    >
                      {getStatusIcon(shipment.currentLocation.status)}
                      {shipment.currentLocation.status === "pending" && t("cargo.pending")}
                      {shipment.currentLocation.status === "in_transit" && t("cargo.inTransit")}
                      {shipment.currentLocation.status === "delivered" && t("cargo.delivered")}
                    </span>
                  </div>
                </div>
                {!isDelivered && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditClick(shipment.id)}
                    disabled={isEditing}
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-600/10"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {t("cargo.edit")}
                  </Button>
                )}
              </div>

              {/* Route */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <p className="text-sm text-slate-400">{t("cargo.sender")}</p>
                  <p className="font-semibold text-white">{shipment.origin.city}</p>
                </div>
                <div className="text-purple-400">→</div>
                <div className="flex-1 text-right">
                  <p className="text-sm text-slate-400">{t("cargo.receiver")}</p>
                  <p className="font-semibold text-white">{shipment.destination.city}</p>
                </div>
              </div>

              {/* Current Location - Editable when not delivered */}
              {isEditing ? (
                <div className="flex items-center gap-2 mb-4 p-4 bg-slate-800/50 rounded-lg border border-purple-400/30">
                  <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div className="flex-1 flex gap-2 items-center">
                    <span className="text-sm text-slate-300">{t("cargo.current")}:</span>
                    <Input
                      value={editData.currentCity}
                      onChange={(e) => setEditData({ ...editData, currentCity: e.target.value })}
                      className="bg-slate-700 border border-purple-400/50 text-white h-8 text-sm"
                      placeholder={t("status.city")}
                    />
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      className="bg-slate-700 border border-purple-400/50 text-white h-8 text-sm px-2 rounded"
                    >
                      <option value="pending">{t("cargo.pending")}</option>
                      <option value="in_transit">{t("cargo.inTransit")}</option>
                      <option value="delivered">{t("cargo.delivered")}</option>
                    </select>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSaveStatus(shipment.id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white h-8"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                    className="text-slate-400 hover:text-slate-300 h-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-4 p-3 bg-slate-800/50 rounded-lg">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-slate-300">
                    {t("cargo.current")}: <span className="text-purple-400 font-semibold">{shipment.currentLocation.city}</span>
                  </span>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400">İlerleme</span>
                  <span className="text-xs font-semibold text-purple-400">{isDelivered ? "100%" : "0%"}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all duration-500"
                    style={{ width: isDelivered ? "100%" : "0%" }}
                  />
                </div>
              </div>

              {/* Delivery Status */}
              <div className="text-xs text-slate-400">
                {isDelivered ? (
                  <span className="text-emerald-400 font-semibold">Teslim edildi</span>
                ) : (
                  <>
                    <span className="text-purple-400 font-semibold">Tahmini Teslim:</span> 3 gün
                  </>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
