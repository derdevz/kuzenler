"use client"

import { useState, useEffect } from "react"
import AdminDashboard from "@/components/admin-dashboard"
import AdminLogin from "@/components/admin-login"
import { useAdminAuth } from "@/hooks/use-admin-auth"

export default function AdminPage() {
  const { isAdminAuthenticated, isLoading } = useAdminAuth()
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated)
  }, [isAdminAuthenticated])

  const handleLoginSuccess = () => {
    setAuthenticated(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-300 mt-4">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  return <AdminDashboard />
}
