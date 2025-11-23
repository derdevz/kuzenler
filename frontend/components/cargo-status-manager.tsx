"use client"

import { useState } from "react"
import { dataStore, type Shipment } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { useLanguage } from "@/context/language-context"

interface CargoStatusManagerProps {
  isAdmin?: boolean
}

export default function CargoStatusManager({ isAdmin }: CargoStatusManagerProps) {
  const { t } = useLanguage()
  const [shipments, setShipments] = useState<Shipment[]>(dataStore.getAllShipments())
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  
  // Form verileri
  const [updateData, setUpdateData] = useState({
    city: "",
    country: "",
    status: "in_transit" as string,
  })
  
  const [searchQuery, setSearchQuery] = useState("")

  const filteredShipments = shipments.filter(
    (s) =>
      s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.origin.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.destination.city.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleUpdateStatus = () => {
    // Basit Validasyon
    if (!selectedShipment) return
    // Şehir boşsa eski şehri kullan, ülke boşsa eski ülkeyi kullan
    const finalCity = updateData.city || selectedShipment.currentLocation.city
    const finalCountry = updateData.country || selectedShipment.currentLocation.country

    console.log("Güncelleme Başlatılıyor:", { finalCity, finalCountry, status: updateData.status })

    // 1. Önce Kargoyu Güncelle
    const updatedShipment = dataStore.updateShipmentStatus(selectedShipment.id, {
      city: finalCity,
      country: finalCountry,
      timestamp: new Date(),
      status: updateData.status as any,
    })

    // 2. BURASI YENİ: Ürünü de Güncelle (Bağladığımız Yer)
    // Eğer kargo güncellendiyse ve bir ürüne bağlıysa, o ürünün de durumunu değiştir.
    if (updatedShipment && updatedShipment.productId) {
       // store.ts dosyasına eklediğimiz yeni fonksiyonu burada çağırıyoruz
       dataStore.updateProductStatus(updatedShipment.productId, updateData.status as any);
       console.log("Bağlı ürün durumu güncellendi:", updatedShipment.productId);
    }

    if (updatedShipment) {
      console.log("Kargo Güncelleme Başarılı");
      // Listeyi yenile
      setShipments([...dataStore.getAllShipments()]) // Yeni referans ile zorla yenile
      setSelectedShipment(updatedShipment)
      setShowUpdateDialog(false)
    } else {
      console.error("Güncelleme Başarısız Oldu");
    }
  }

  // Dialog açma fonksiyonu
  const openUpdateDialog = () => {
    if (selectedShipment) {
      setUpdateData({
        city: selectedShipment.currentLocation.city,
        country: selectedShipment.currentLocation.country,
        status: selectedShipment.currentLocation.status
      })
      setShowUpdateDialog(true)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case "delayed": return <AlertCircle className="w-5 h-5 text-red-400" />
      case "in_transit": return <Clock className="w-5 h-5 text-blue-400" />
      default: return <MapPin className="w-5 h-5 text-yellow-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-600"
      case "delayed": return "bg-red-600"
      case "in_transit": return "bg-blue-600"
      default: return "bg-yellow-600"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered": return t("cargo.delivered")
      case "delayed": return "Gecikmeli"
      case "in_transit": return t("cargo.inTransit")
      case "pending": return t("cargo.pending")
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">{t("status.title")}</h2>
        <p className="text-purple-300/70">{t("status.description")}</p>
      </div>

      {/* Search */}
      <Input
        placeholder={t("status.search")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-slate-800/50 border-purple-500/30 text-white placeholder-purple-300/50"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipments List */}
        <div className="lg:col-span-1">
          <Card className="border-purple-500/30 bg-slate-800/50 backdrop-blur">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{t("cargo.tracking")} ({filteredShipments.length})</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredShipments.map((shipment) => (
                  <button
                    key={shipment.id}
                    onClick={() => {
                      setSelectedShipment(shipment)
                      setShowUpdateDialog(false)
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedShipment?.id === shipment.id
                        ? "bg-purple-600/40 border border-purple-400"
                        : "bg-slate-700/30 hover:bg-slate-600/40 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {getStatusIcon(shipment.currentLocation.status)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">{shipment.trackingNumber}</p>
                        <p className="text-purple-300/70 text-xs">
                          {shipment.origin.city} → {shipment.destination.city}
                        </p>
                        <Badge className={`${getStatusColor(shipment.currentLocation.status)} text-white text-xs mt-1`}>
                          {getStatusLabel(shipment.currentLocation.status)}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Shipment Details */}
        <div className="lg:col-span-2">
          {selectedShipment ? (
            <div className="space-y-4">
              {/* Current Status */}
              <Card className="border-purple-500/30 bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{selectedShipment.trackingNumber}</h4>
                      <p className="text-purple-300/70 text-sm">Tracking ID</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedShipment.currentLocation.status)}
                      <Badge className={`${getStatusColor(selectedShipment.currentLocation.status)} text-white`}>
                        {getStatusLabel(selectedShipment.currentLocation.status)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-purple-300/70 text-sm mb-1">Başlangıç</p>
                      <p className="text-white font-medium">{selectedShipment.origin.city}</p>
                      <p className="text-purple-300/70 text-xs">{selectedShipment.origin.country}</p>
                    </div>
                    <div>
                      <p className="text-purple-300/70 text-sm mb-1">Hedef</p>
                      <p className="text-white font-medium">{selectedShipment.destination.city}</p>
                      <p className="text-purple-300/70 text-xs">{selectedShipment.destination.country}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-purple-300/70 text-sm mb-1">Mevcut Konum</p>
                      <p className="text-white font-medium">{selectedShipment.currentLocation.city}</p>
                      <p className="text-purple-300/70 text-xs">{selectedShipment.currentLocation.country}</p>
                      <p className="text-purple-300/50 text-xs mt-1">
                        {new Date(selectedShipment.currentLocation.timestamp).toLocaleString("tr-TR")}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Update Button - SADECE ADMIN GÖREBİLİR */}
              {isAdmin && (
                <Button
                  onClick={openUpdateDialog}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {t("status.updateStatus")}
                </Button>
              )}
            </div>
          ) : (
            <Card className="border-purple-500/30 bg-slate-800/50 backdrop-blur h-full flex items-center justify-center min-h-96">
              <div className="text-center">
                <p className="text-purple-300/70">{t("status.selectHint")}</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Update Status Dialog */}
      {selectedShipment && (
        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent className="border-purple-500/30 bg-slate-900 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">{t("status.updateDialog")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">{t("status.city")}</label>
                <Input
                  placeholder={t("status.city")}
                  value={updateData.city}
                  onChange={(e) => setUpdateData({ ...updateData, city: e.target.value })}
                  className="bg-slate-800 border-purple-500/30 text-white placeholder-purple-300/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">{t("status.country")}</label>
                <Input
                  placeholder={t("status.country")}
                  value={updateData.country}
                  onChange={(e) => setUpdateData({ ...updateData, country: e.target.value })}
                  className="bg-slate-800 border-purple-500/30 text-white placeholder-purple-300/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">{t("status.status")}</label>
                {/* Standart HTML Select - Sorunsuz çalışır */}
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  className="w-full bg-slate-800 border border-purple-500/30 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pending">Bekleniyor</option>
                  <option value="in_transit">Yolda</option>
                  <option value="delayed">Gecikmeli</option>
                  <option value="delivered">Teslim Edildi</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowUpdateDialog(false)}
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-600/10"
                >
                  İptal
                </Button>
                <Button onClick={handleUpdateStatus} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Güncelle
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}