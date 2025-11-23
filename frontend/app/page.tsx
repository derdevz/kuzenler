"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import LoginView from "@/components/login-view"
import AdminDashboard from "@/components/admin-dashboard"
import CustomerPortal from "@/components/customer-portal"
import CargoStatusManager from "@/components/cargo-status-manager"
import SettingsPage from "@/components/settings-page"
import { dataStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Settings, BarChart3, Package, Truck, LogOut, Shield } from "lucide-react"
import type { WalletSession } from "@/lib/freighter-utils"
import { fetchXLMBalance } from "@/lib/freighter-utils"
import { useLanguage } from "@/context/language-context"

export default function Home() {
  const { language, t } = useLanguage()
  const [isConnected, setIsConnected] = useState(false)
  const [walletSession, setWalletSession] = useState<WalletSession | null>(null)
  const [customerId, setCustomerId] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentView, setCurrentView] = useState<"dashboard" | "products" | "cargo" | "settings">("dashboard")
  const [customerBalance, setCustomerBalance] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem("stellar-session")
    if (stored) {
      try {
        const session = JSON.parse(stored) as WalletSession
        setWalletSession(session)
        setIsConnected(true)

        // Check if user is admin
        const adminStatus = dataStore.isAdmin(session.publicKey)
        setIsAdmin(adminStatus)

        // Get customer info if not admin
        if (!adminStatus) {
          const customer = dataStore.getCustomerByWallet(session.publicKey)
          if (customer) {
            setCustomerId(customer.id)
            setCustomerName(customer.name)
          }
        } else {
          setCustomerName("Admin")
        }
      } catch (e) {
        console.error("[v0] Failed to restore session:", e)
      }
    }
  }, [])

  const handleConnect = (session: WalletSession) => {
    setWalletSession(session)
    setCustomerBalance(session.xlmBalance || 0)

    // Check if user is admin
    const adminStatus = dataStore.isAdmin(session.publicKey)
    setIsAdmin(adminStatus)

    if (adminStatus) {
      setCustomerName("Admin")
      setCurrentView("dashboard")
    } else {
      let customer = dataStore.getCustomerByWallet(session.publicKey)
      if (!customer) {
        customer = dataStore.addCustomer({
          walletAddress: session.publicKey,
          name: "Müşteri",
          email: "customer@example.com",
          phone: "+90 555 123 4567",
          address: "İstanbul, Türkiye",
        })
      }

      setCustomerId(customer.id)
      setCustomerName(customer.name)
      setCurrentView("products")
    }

    setIsConnected(true)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setWalletSession(null)
    setCustomerId("")
    setCustomerName("")
    setIsAdmin(false)
    setCurrentView("dashboard")
    localStorage.removeItem("stellar-session")
  }

  if (!isConnected) {
    return <LoginView onConnect={handleConnect} />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Bar */}
      <nav className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Kuzenler</h1>
                <p className="text-xs text-purple-300/50">{isAdmin ? t("nav.adminPanel") : t("nav.customerPortal")}</p>
              </div>
            </div>
            <Link href="/admin">
  <Button 
    variant="outline" 
    className="border-purple-500/30 text-purple-300 hover:bg-purple-600/10 bg-transparent gap-2 mr-2"
  >
    <Shield className="w-4 h-4" />
    <span>Admin</span>
  </Button>
</Link>

            {/* Navigation Tabs - Different views for admin and customer */}
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <>
                  <Button
                    onClick={() => setCurrentView("dashboard")}
                    variant={currentView === "dashboard" ? "default" : "outline"}
                    className={`gap-2 ${
                      currentView === "dashboard"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "border-purple-500/30 text-purple-300 hover:bg-purple-600/10"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">{t("nav.customers")}</span>
                  </Button>

                  <Button
                    onClick={() => setCurrentView("cargo")}
                    variant={currentView === "cargo" ? "default" : "outline"}
                    className={`gap-2 ${
                      currentView === "cargo"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "border-purple-500/30 text-purple-300 hover:bg-purple-600/10"
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span className="hidden sm:inline">{t("nav.cargoManage")}</span>
                  </Button>

                  <Button
                    onClick={() => setCurrentView("settings")}
                    variant={currentView === "settings" ? "default" : "outline"}
                    className={`gap-2 ${
                      currentView === "settings"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "border-purple-500/30 text-purple-300 hover:bg-purple-600/10"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">{t("nav.settings")}</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setCurrentView("products")}
                    variant={currentView === "products" ? "default" : "outline"}
                    className={`gap-2 ${
                      currentView === "products"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "border-purple-500/30 text-purple-300 hover:bg-purple-600/10"
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span className="hidden sm:inline">{t("nav.myProducts")}</span>
                  </Button>

                  <Button
                    onClick={() => setCurrentView("cargo")}
                    variant={currentView === "cargo" ? "default" : "outline"}
                    className={`gap-2 ${
                      currentView === "cargo"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "border-purple-500/30 text-purple-300 hover:bg-purple-600/10"
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span className="hidden sm:inline">{t("nav.tracking")}</span>
                  </Button>

                  <Button
                    onClick={() => setCurrentView("settings")}
                    variant={currentView === "settings" ? "default" : "outline"}
                    className={`gap-2 ${
                      currentView === "settings"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "border-purple-500/30 text-purple-300 hover:bg-purple-600/10"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">{t("nav.settings")}</span>
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden md:flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-purple-400">
                    {isAdmin ? walletSession?.xlmBalance?.toFixed(2) : customerBalance?.toFixed(2) || "0.00"} XLM
                  </span>
                </div>
                <p className="text-xs text-purple-300/50">
                  {walletSession?.publicKey.slice(0, 8)}...{walletSession?.publicKey.slice(-4)}
                </p>
              </div>

              {isAdmin && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-600/10 bg-transparent gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
              )}

              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-600/10 bg-transparent gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t("nav.logout")}</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentView === "dashboard" && isAdmin && <AdminDashboard />}
        {currentView === "products" && !isAdmin && (
          <CustomerPortal 
            customerId={customerId} 
            customerName={customerName}
            customerBalance={customerBalance}
            onBalanceUpdate={setCustomerBalance}
          />
        )}
        {currentView === "cargo" && <CargoStatusManager isAdmin={isAdmin} />}
        {currentView === "settings" && <SettingsPage userName={customerName} />}
      </div>
    </main>
  )
}
