"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle, Lock, User } from "lucide-react"
import { ADMIN_CREDENTIALS } from "@/lib/store"
import { useLanguage } from "@/context/language-context"

interface AdminLoginProps {
  onLoginSuccess: () => void
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const { t } = useLanguage()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Simple credential check (no hashing)
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Set admin session in localStorage
      const adminSession = {
        isAdmin: true,
        loginTime: new Date().toISOString(),
      }
      localStorage.setItem("admin-session", JSON.stringify(adminSession))
      setLoading(false)
      onLoginSuccess()
    } else {
      setError("Geçersiz kullanıcı adı veya şifre")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md border-purple-500/30 bg-slate-900/50 backdrop-blur">
        <div className="p-8 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-full bg-purple-600/20 border border-purple-500/30">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center text-3xl md:text-4xl font-bold mb-2 text-white">Admin Panel</h1>
          <p className="text-center text-slate-300 text-sm mb-8">Yönetici giriş sayfası</p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-sm text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" />
                Kullanıcı Adı
              </label>
              <Input
                type="text"
                placeholder="Kullanıcı adını girin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="bg-slate-800/50 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm text-slate-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                Şifre
              </label>
              <Input
                type="password"
                placeholder="Şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-slate-800/50 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>

          {/* Info Text */}
          <div className="mt-8 p-4 rounded-lg bg-slate-800/30 border border-purple-500/20">
            <p className="text-xs text-slate-400 text-center">
              Admin paneline erişim için doğru kimlik bilgilerini girin
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
