"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { dataStore, type Customer, type Shipment } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ChevronRight, Mail, Phone, MapPin, Package, LogOut, Edit, Truck, RefreshCw } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useAdminAuth } from "@/hooks/use-admin-auth"

interface AdminDashboardProps {
  onLogout?: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const { logout } = useAdminAuth()
  
  const [customers, setCustomers] = useState<Customer[]>(dataStore.getAllCustomers())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  
  // Müşteri Düzenleme State'leri
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  })

  const handleLogout = () => {
    logout()
    if (onLogout) onLogout()
    localStorage.removeItem("admin-session")
    router.push("/") 
  }

  const openEditDialog = () => {
    if (!selectedCustomer) return
    setEditFormData({
      name: selectedCustomer.name,
      email: selectedCustomer.email,
      phone: selectedCustomer.phone,
      address: selectedCustomer.address
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveCustomer = () => {
    if (!selectedCustomer) return
    const updated = dataStore.updateCustomer(selectedCustomer.id, {
      name: editFormData.name,
      email: editFormData.email,
      phone: editFormData.phone,
      address: editFormData.address
    })

    if (updated) {
      setSelectedCustomer(updated)
      setCustomers(dataStore.getAllCustomers())
      setIsEditDialogOpen(false)
    }
  }

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery, customers])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">{t("nav.adminPanel")}</h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-600/10 bg-transparent gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t("nav.logout")}</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t("nav.adminPanel")}</h1>
          <p className="text-purple-300">{t("admin.description")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="border-purple-500/30 bg-slate-800/50 backdrop-blur">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">{t("admin.title")} ({customers.length})</h2>
                <Input
                  placeholder={t("admin.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-4 bg-slate-700/50 border-purple-500/30 text-white placeholder-purple-300/50"
                />
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        selectedCustomer?.id === customer.id
                          ? "bg-purple-600/40 border border-purple-400"
                          : "bg-slate-700/30 hover:bg-slate-600/40 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm">{customer.name}</p>
                          <p className="text-purple-300/70 text-xs">{customer.walletAddress}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-purple-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedCustomer ? (
              <div className="space-y-6">
                <Card className="border-purple-500/30 bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{selectedCustomer.name}</h3>
                        <p className="text-purple-300 text-sm">{selectedCustomer.walletAddress}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={openEditDialog}
                          size="sm" 
                          variant="outline" 
                          className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Düzenle
                        </Button>
                        <Badge className="bg-purple-600 text-white h-8 flex items-center">{t("nav.customerPortal")}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-purple-300/70 text-sm">{t("admin.email")}</p>
                          <p className="text-white font-medium">{selectedCustomer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-purple-300/70 text-sm">{t("admin.phone")}</p>
                          <p className="text-white font-medium">{selectedCustomer.phone}</p>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-purple-300/70 text-sm">{t("settings.profile")}</p>
                          <p className="text-white font-medium">{selectedCustomer.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="border-purple-500/30 bg-slate-800/50 backdrop-blur">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-5 h-5 text-purple-400" />
                      <h4 className="text-lg font-semibold text-white">{t("cargo.tracking")}</h4>
                    </div>
                    {/* YENİ GÜNCELLENMİŞ BİLEŞEN */}
                    <CustomerShipments customerId={selectedCustomer.id} />
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="border-purple-500/30 bg-slate-800/50 backdrop-blur h-full flex items-center justify-center">
                <div className="text-center p-12">
                  <p className="text-purple-300/70">{t("admin.selectCustomer")}</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-900 border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle>Müşteri Bilgilerini Düzenle</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-purple-300">İsim Soyisim</Label>
              <Input
                id="name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="bg-slate-800 border-purple-500/30 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-purple-300">E-posta</Label>
              <Input
                id="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                className="bg-slate-800 border-purple-500/30 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-purple-300">Telefon</Label>
              <Input
                id="phone"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                className="bg-slate-800 border-purple-500/30 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address" className="text-purple-300">Adres</Label>
              <Input
                id="address"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                className="bg-slate-800 border-purple-500/30 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-purple-500/30 text-purple-300 hover:bg-purple-600/10">
              İptal
            </Button>
            <Button onClick={handleSaveCustomer} className="bg-purple-600 hover:bg-purple-700 text-white">
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ---- YENİ GÜNCELLENMİŞ VE TARİHÇELİ KARGO LİSTESİ ----
function CustomerShipments({ customerId }: { customerId: string }) {
  const { t } = useLanguage()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [updateData, setUpdateData] = useState({ city: "", country: "", status: "in_transit" })

  // İlk yüklemede ve güncellemede verileri çek
  useEffect(() => {
    setShipments(dataStore.getShipmentsByCustomer(customerId))
  }, [customerId])

  const openUpdateDialog = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setUpdateData({
      city: shipment.currentLocation.city,
      country: shipment.currentLocation.country,
      status: shipment.currentLocation.status
    })
    setIsUpdateDialogOpen(true)
  }

  const handleUpdateStatus = () => {
    if (!selectedShipment) return

    // 1. Store'da Kargoyu Güncelle
    const updatedShipment = dataStore.updateShipmentStatus(selectedShipment.id, {
      city: updateData.city || selectedShipment.currentLocation.city,
      country: updateData.country || selectedShipment.currentLocation.country,
      timestamp: new Date(),
      status: updateData.status as any
    })

    // 2. Ürünü de Güncelle
    if (updatedShipment && updatedShipment.productId) {
      dataStore.updateProductStatus(updatedShipment.productId, updateData.status as any)
    }

    // 3. Ekranı Yenile
    setShipments([...dataStore.getShipmentsByCustomer(customerId)])
    setIsUpdateDialogOpen(false)
  }

  if (shipments.length === 0) {
    return <p className="text-purple-300/70 text-center py-8">{t("cargo.noRecords")}</p>
  }

  return (
    <>
      <div className="space-y-6">
        {shipments.map((shipment) => (
          <div key={shipment.id} className="bg-slate-700/30 border border-purple-500/20 rounded-lg overflow-hidden">
            
            {/* ÜST KISIM: GENEL BİLGİLER */}
            <div className="p-4 border-b border-purple-500/10">
              <div className="flex items-center justify-between mb-2">
                <div>
                   <span className="font-bold text-white text-lg">{shipment.trackingNumber}</span>
                   <p className="text-xs text-purple-300">
                     {shipment.origin.city} → {shipment.destination.city}
                   </p>
                </div>
                
                {/* SAĞ TARAFTA BUTON */}
                <Button 
                  size="sm" 
                  onClick={() => openUpdateDialog(shipment)}
                  className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Durumu Güncelle
                </Button>
              </div>
            </div>

            {/* ALT KISIM: TRANSFER GEÇMİŞİ (MİNİ KUTULAR) */}
            <div className="p-4 bg-slate-800/20">
              <p className="text-xs font-semibold text-purple-300 mb-3 uppercase tracking-wider">Transfer Geçmişi</p>
              
              <div className="space-y-0 relative">
                {/* Dikey Çizgi */}
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-purple-500/20"></div>

                {shipment.route.map((event, index) => (
                  <div key={index} className="relative pl-6 pb-4 last:pb-0 group">
                    {/* Nokta */}
                    <div className={`absolute left-[5px] top-3 w-2 h-2 rounded-full border border-slate-900 ${
                       index === shipment.route.length - 1 ? "bg-green-500 ring-4 ring-green-500/20" : "bg-purple-500"
                    }`}></div>

                    {/* MİNİ KUTU */}
                    <div className="bg-slate-800 border border-purple-500/10 p-3 rounded-md shadow-sm hover:border-purple-500/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-white">{event.city}, {event.country}</p>
                          <p className="text-xs text-purple-400 mt-0.5">
                            {new Date(event.timestamp).toLocaleString("tr-TR", { 
                              day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' 
                            })}
                          </p>
                        </div>
                        <Badge
                          className={`text-[10px] px-2 py-0.5 ${
                            event.status === "delivered"
                              ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                              : event.status === "in_transit"
                                ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                                : "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30"
                          }`}
                        >
                          {event.status === "delivered"
                            ? t("cargo.delivered")
                            : event.status === "in_transit"
                              ? t("cargo.inTransit")
                              : t("cargo.pending")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        ))}
      </div>

      {/* GÜNCELLEME PENCERESİ */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="bg-slate-900 border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle>Transfer Durumu Ekle</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="grid gap-2">
              <Label className="text-purple-300">Şehir</Label>
              <Input
                value={updateData.city}
                onChange={(e) => setUpdateData({ ...updateData, city: e.target.value })}
                className="bg-slate-800 border-purple-500/30 text-white"
              />
            </div>
             <div className="grid gap-2">
              <Label className="text-purple-300">Ülke</Label>
              <Input
                value={updateData.country}
                onChange={(e) => setUpdateData({ ...updateData, country: e.target.value })}
                className="bg-slate-800 border-purple-500/30 text-white"
              />
            </div>
             <div className="grid gap-2">
              <Label className="text-purple-300">Yeni Durum</Label>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)} className="border-purple-500/30 text-purple-300 hover:bg-purple-600/10">
              İptal
            </Button>
            <Button onClick={handleUpdateStatus} className="bg-purple-600 hover:bg-purple-700 text-white">
              Transferi Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}