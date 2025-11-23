"use client"

import { Button } from "@/components/ui/button"
import { Zap, AlertCircle } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useEffect } from "react"

interface LoginViewProps {
  onConnect: (session: any) => void
}

export default function LoginView({ onConnect }: LoginViewProps) {
  const { session, loading, error, connect } = useWallet()

  useEffect(() => {
    if (session && session.isConnected) {
      onConnect(session)
    }
  }, [session, onConnect])

  const handleConnect = async () => {
    try {
      await connect()
    } catch (err) {
      console.error("[v0] Connection error:", err)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="neon-border rounded-xl p-8 md:p-12 bg-slate-900/50 backdrop-blur-sm">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-full bg-purple-600/20 neon-glow">
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center text-3xl md:text-4xl font-bold mb-3 neon-glow">Kuzenler</h1>

          {/* Subtitle */}
          <p className="text-center text-slate-300 text-sm mb-8">Kargolarınızı kolayca takip edin ve yönetin</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <Button
            onClick={handleConnect}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg mb-4 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {loading ? "Connecting..." : "Connect Freighter Wallet"}
          </Button>

          {/* Info Text */}
          <p className="text-center text-xs text-slate-400 mt-6">
            Cüzdan bağlantınız güvenlidir. Kuzenler asla özel anahtarınıza erişmez.
          </p>
        </div>
      </div>
    </div>
  )
}
