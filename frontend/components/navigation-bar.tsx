"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationBarProps {
  walletAddress: string
  onDisconnect: () => void
}

export default function NavigationBar({ walletAddress, onDisconnect }: NavigationBarProps) {
  return (
    <nav className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo / Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">✦</span>
          </div>
          <h1 className="text-xl font-bold text-white hidden sm:block">Kuzenler</h1>
        </div>

        {/* Wallet Info & Disconnect */}
        <div className="flex items-center gap-4">
          {/* Wallet Address */}
          <div className="hidden sm:flex items-center px-4 py-2 rounded-lg bg-slate-800/50 border border-purple-500/30">
            <span className="text-sm text-slate-300">
              <span className="text-slate-500">Wallet: </span>
              <span className="text-purple-400 font-mono font-semibold">{walletAddress}</span>
            </span>
          </div>

          {/* Disconnect Button */}
          <Button
            onClick={onDisconnect}
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-purple-400 hover:bg-purple-600/20 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Disconnect</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
