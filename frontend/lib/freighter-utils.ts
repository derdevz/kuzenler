"use client"

export interface WalletSession {
  publicKey: string
  isConnected: boolean
  xlmBalance: number | null
  network: "public" | "testnet"
}

// Demo wallet addresses for testing - REMOVED, using Freighter only
// const DEMO_WALLETS = [...]

// In-memory session storage
let currentSession: WalletSession | null = null

export async function connectFreighter(): Promise<WalletSession> {
  try {
    const freighterApi = (window as any).freighterApi

    if (!freighterApi || typeof freighterApi.requestAccess !== "function") {
      throw new Error("Freighter extension not installed. Please install Freighter wallet.")
    }

    const result = await freighterApi.requestAccess()

    if (result?.error || !result?.address) {
      throw new Error(result?.error || "No address returned from Freighter")
    }

    const publicKey = result.address
    console.log("[v0] Connected with Freighter:", publicKey)

    const session: WalletSession = {
      publicKey,
      isConnected: true,
      xlmBalance: null,
      network: "testnet",
    }

    currentSession = session
    localStorage.setItem("stellar-session", JSON.stringify(session))
    return session
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to connect Freighter wallet"
    console.error("[v0] Freighter connection failed:", errorMessage)
    throw error
  }
}

export async function fetchXLMBalance(publicKey: string): Promise<number> {
  try {
    // Horizon testnet API - tüm işlemler testnet'te yapılır
    const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`)
    if (!response.ok) {
      throw new Error("Failed to fetch balance")
    }

    const data = await response.json()
    const nativeBalance = data.balances.find((balance: any) => balance.asset_type === "native")
    return Number.parseFloat(nativeBalance?.balance || "0")
  } catch (error) {
    console.error("[v0] Error fetching XLM balance:", error)
    return 0
  }
}

export function getCurrentSession(): WalletSession | null {
  if (currentSession) return currentSession

  const stored = localStorage.getItem("stellar-session")
  if (stored) {
    try {
      currentSession = JSON.parse(stored)
      return currentSession
    } catch (e) {
      console.error("[v0] Error parsing stored session:", e)
    }
  }

  return null
}

export function disconnectWallet(): void {
  currentSession = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("stellar-session")
    localStorage.removeItem("stellar-wallet")
  }
}

export function updateSessionBalance(balance: number): void {
  if (currentSession) {
    currentSession.xlmBalance = balance
    localStorage.setItem("stellar-session", JSON.stringify(currentSession))
  }
}
