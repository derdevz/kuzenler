"use client"

import { useState } from "react"
import { dataStore, type Product } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Trash2, Package, Truck, Clock, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import PaymentConfirmation from "@/components/payment-confirmation"

interface CustomerPortalProps {
  customerId: string
  customerName: string
  customerBalance?: number
  onBalanceUpdate?: (newBalance: number) => void
}

export default function CustomerPortal({ 
  customerId, 
  customerName, 
  customerBalance = 0,
  onBalanceUpdate 
}: CustomerPortalProps) {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>(dataStore.getProductsByCustomer(customerId))
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 1,
    origin: "", // added origin and destination fields
    destination: "",
  })

  const COMMISSION_PER_PRODUCT = 0.0001 // XLM per product

  const handleAddProduct = () => {
    if (!formData.name.trim() || !formData.origin.trim() || !formData.destination.trim()) return

    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      customerId,
      name: formData.name,
      description: formData.description,
      quantity: formData.quantity,
      status: "pending",
      origin: formData.origin,
      destination: formData.destination,
      createdAt: new Date(),
    }

    // Ödeme dialogunu aç
    setPendingProduct(newProduct)
    setPaymentDialogOpen(true)
    setShowAddDialog(false)
  }

const handleConfirmPayment = async () => {
    if (!pendingProduct) return

    const totalCost = COMMISSION_PER_PRODUCT * pendingProduct.quantity

    // 1. XLM Bakiyesini güncelle
    const newBalance = customerBalance - totalCost
    if (onBalanceUpdate) {
      onBalanceUpdate(newBalance)
    }

    // 2. Ürünü ekle
    const savedProduct = dataStore.addProduct({
      customerId,
      name: pendingProduct.name,
      description: pendingProduct.description,
      quantity: pendingProduct.quantity,
      status: "pending",
      origin: pendingProduct.origin,
      destination: pendingProduct.destination,
    })

    // --- KARGO SİSTEMİNE KAYIT ---
    
    const trackingNumber = `TRK-${Math.floor(100000 + Math.random() * 900000)}`

    dataStore.addShipment({
      trackingNumber: trackingNumber,
      customerId: customerId,
      productId: savedProduct.id,
      origin: {
        // HATA ÇÖZÜMÜ: Sonuna || "" ekledik. "Eğer boşsa boş yazı gönder" dedik.
        city: pendingProduct.origin || "İstanbul", 
        country: "Türkiye", 
        timestamp: new Date(),
        status: "pending" 
      },
      destination: {
        // HATA ÇÖZÜMÜ: Buraya da ekledik
        city: pendingProduct.destination || "Ankara",
        country: "Türkiye",
        timestamp: new Date(),
        status: "pending"
      },
      currentLocation: {
        // HATA ÇÖZÜMÜ: Buraya da ekledik
        city: pendingProduct.origin || "İstanbul",
        country: "Türkiye",
        status: "pending",
        timestamp: new Date(),
      },
      estimatedDelivery: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)), 
      route: [
        {
          city: pendingProduct.origin || "İstanbul",
          country: "Türkiye",
          status: "pending",
          timestamp: new Date(),
        }
      ]
    })
    // ---------------------------------------------

    setProducts([...products, savedProduct])
    setFormData({ name: "", description: "", quantity: 1, origin: "", destination: "" })
    setPendingProduct(null)
  }

  const handleCancelPayment = () => {
    setPendingProduct(null)
    setFormData({ name: "", description: "", quantity: 1, origin: "", destination: "" })
  }

  const handleDeleteProduct = (productId: string) => {
    dataStore.deleteProduct(productId)
    setProducts(products.filter((p) => p.id !== productId))
    setSelectedProduct(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-600/20 border-emerald-500/50 text-emerald-300"
      case "in_transit":
        return "bg-blue-600/20 border-blue-500/50 text-blue-300"
      case "pending":
        return "bg-yellow-600/20 border-yellow-500/50 text-yellow-300"
      default:
        return "bg-slate-600/20 border-slate-500/50 text-slate-300"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
        return t("cargo.delivered")
      case "in_transit":
        return t("cargo.inTransit")
      case "pending":
        return t("cargo.pending")
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="w-4 h-4" />
      case "in_transit":
        return <Truck className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const stats = {
    total: products.length,
    pending: products.filter((p) => p.status === "pending").length,
    inTransit: products.filter((p) => p.status === "in_transit").length,
    delivered: products.filter((p) => p.status === "delivered").length,
  }

  return (
    <div className="space-y-8">
      {/* Header with Welcome and Add Button */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Ürün Yönetim Paneli</h1>
          <p className="text-purple-300/70 text-lg">
            Hoşgeldiniz, <span className="font-semibold text-purple-300">{customerName}</span>
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold px-6 h-12 rounded-lg shadow-lg shadow-purple-600/30 transition-all hover:shadow-purple-600/50"
        >
          <Plus className="w-5 h-5 mr-2" />
          Yeni Ürün Ekle
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-900/30 to-slate-900/30 backdrop-blur-xl p-6 hover:from-purple-900/40 hover:to-slate-900/40 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <p className="text-purple-300/70 text-sm font-medium mb-2">Toplam Ürün</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <div className="mt-3 h-1 bg-purple-600/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-yellow-900/30 to-slate-900/30 backdrop-blur-xl p-6 hover:from-yellow-900/40 hover:to-slate-900/40 transition-all">
          <div className="relative">
            <p className="text-yellow-300/70 text-sm font-medium mb-2">Bekleniyor</p>
            <p className="text-3xl font-bold text-yellow-300">{stats.pending}</p>
            <div className="mt-3 h-1 bg-yellow-600/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full"
                style={{ width: stats.total ? `${(stats.pending / stats.total) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-900/30 to-slate-900/30 backdrop-blur-xl p-6 hover:from-blue-900/40 hover:to-slate-900/40 transition-all">
          <div className="relative">
            <p className="text-blue-300/70 text-sm font-medium mb-2">Yolda</p>
            <p className="text-3xl font-bold text-blue-300">{stats.inTransit}</p>
            <div className="mt-3 h-1 bg-blue-600/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                style={{ width: stats.total ? `${(stats.inTransit / stats.total) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-900/30 to-slate-900/30 backdrop-blur-xl p-6 hover:from-emerald-900/40 hover:to-slate-900/40 transition-all">
          <div className="relative">
            <p className="text-emerald-300/70 text-sm font-medium mb-2">Teslim Edildi</p>
            <p className="text-3xl font-bold text-emerald-300">{stats.delivered}</p>
            <div className="mt-3 h-1 bg-emerald-600/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                style={{ width: stats.total ? `${(stats.delivered / stats.total) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Products Grid or Empty State */}
      {products.length === 0 ? (
        <Card className="border border-purple-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur p-16 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
              <Package className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Henüz Ürün Eklemediniz</h3>
            <p className="text-purple-300/70 max-w-sm">Yeni bir ürün ekleyerek başlayın ve kargo takibinizi başlatın</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
            Ürün Kataloğu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card
                key={product.id}
                className="border border-purple-500/20 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur overflow-hidden hover:border-purple-400/40 transition-all cursor-pointer group shadow-lg hover:shadow-purple-600/20"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:to-transparent transition-all duration-300" />
                <div className="relative p-5">
                  {/* Header with Title and Delete */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2 text-sm">
                        {product.name}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (product.status !== "delivered") {
                          handleDeleteProduct(product.id)
                        }
                      }}
                      disabled={product.status === "delivered"}
                      className="text-red-400/60 hover:text-red-300 hover:bg-red-400/10 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-purple-300/60 line-clamp-2 mb-4 leading-relaxed">
                    {product.description || "Açıklama eklenmedi"}
                  </p>

                  {/* Status Badge and Quantity */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-purple-500/10">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}
                    >
                      {getStatusIcon(product.status)}
                      <span>{getStatusLabel(product.status)}</span>
                    </div>
                    <span className="text-xs text-purple-300 font-medium bg-purple-600/20 px-2.5 py-1.5 rounded-full">
                      {product.quantity}x
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <Card className="border border-purple-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur p-8 mt-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-600/5 to-transparent rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedProduct.name}</h3>
                <p className="text-purple-300/70">{selectedProduct.description}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedProduct(null)}
                className="text-purple-300 hover:bg-purple-600/20 hover:text-purple-200 rounded-lg"
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-600/10 border border-purple-500/20 rounded-lg p-4">
                <p className="text-purple-300/70 text-sm mb-2">Durum</p>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(selectedProduct.status)}`}
                >
                  {getStatusIcon(selectedProduct.status)}
                  {getStatusLabel(selectedProduct.status)}
                </div>
              </div>
              <div className="bg-purple-600/10 border border-purple-500/20 rounded-lg p-4">
                <p className="text-purple-300/70 text-sm mb-2">Miktar</p>
                <p className="text-xl font-bold text-white">{selectedProduct.quantity}</p>
              </div>
              <div className="bg-purple-600/10 border border-purple-500/20 rounded-lg p-4">
                <p className="text-purple-300/70 text-sm mb-2">Ürün ID</p>
                <p className="text-xs font-mono text-purple-300 break-all">{selectedProduct.id.slice(0, 8)}...</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="border border-purple-500/30 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Yeni Ürün Ekle</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2">Ürün Adı *</label>
              <Input
                placeholder="Ürün adını girin"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-800/50 border border-purple-500/30 text-white placeholder-purple-300/40 focus:border-purple-400/60 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2">Açıklama</label>
              <Textarea
                placeholder="Ürün açıklamasını girin"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-800/50 border border-purple-500/30 text-white placeholder-purple-300/40 focus:border-purple-400/60 resize-none rounded-lg"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">Nereden (Şehir) *</label>
                <Input
                  placeholder="İstanbul"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="bg-slate-800/50 border border-purple-500/30 text-white placeholder-purple-300/40 focus:border-purple-400/60 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">Nereye (Şehir) *</label>
                <Input
                  placeholder="Ankara"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="bg-slate-800/50 border border-purple-500/30 text-white placeholder-purple-300/40 focus:border-purple-400/60 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2">Miktar</label>
              <Input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 1 })}
                className="bg-slate-800/50 border border-purple-500/30 text-white focus:border-purple-400/60 rounded-lg"
              />
            </div>
            <div className="flex gap-3 justify-end pt-6 border-t border-purple-500/20">
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-600/10 hover:border-purple-400/50 rounded-lg"
              >
                İptal
              </Button>
              <Button
                onClick={handleAddProduct}
                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold rounded-lg"
              >
                Ürün Ekle
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Confirmation Dialog */}
      {pendingProduct && (
        <PaymentConfirmation
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          amount={COMMISSION_PER_PRODUCT}
          quantity={pendingProduct.quantity}
          productName={pendingProduct.name}
          customerBalance={customerBalance}
          onConfirm={handleConfirmPayment}
          onCancel={handleCancelPayment}
        />
      )}
    </div>
  )
}
