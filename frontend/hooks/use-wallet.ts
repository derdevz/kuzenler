"use client"

import { useEffect, useState } from "react"
import {
  connectFreighter,
  fetchXLMBalance,
  getCurrentSession,
  disconnectWallet,
  updateSessionBalance,
  type WalletSession,
} from "@/lib/freighter-utils"

export function useWallet() {
  const [session, setSession] = useState<WalletSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sayfayı yüklendiğinde localStorage temizle - her zaman fresh start
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("stellar-session")
      // Başka cached session'ları da temizle
      setSession(null)
    }
  }, [])

  const connect = async () => {
    setLoading(true)
    setError(null)
    try {
      const newSession = await connectFreighter()
      const balance = await fetchXLMBalance(newSession.publicKey)
      updateSessionBalance(balance)
      newSession.xlmBalance = balance
      setSession(newSession)
      console.log("[v0] Wallet connected successfully")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect wallet"
      setError(message)
      console.error("[v0] Connection failed:", message)
    } finally {
      setLoading(false)
    }
  }

  const disconnect = () => {
    disconnectWallet()
    setSession(null)
    setError(null)
  }

  return {
    session,
    loading,
    error,
    connect,
    disconnect,
  }
}
