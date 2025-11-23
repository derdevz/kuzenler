"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface ThemeContextType {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Client-side'da localStorage'dan oku
    const saved = localStorage.getItem("kuzenler-theme")
    const isDark = saved ? JSON.parse(saved) : true
    setDarkModeState(isDark)
    setMounted(true)

    // HTML element'ini güncelle
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value)
    localStorage.setItem("kuzenler-theme", JSON.stringify(value))

    // HTML element'ini güncelle
    if (value) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Server-side rendering sırasında default dark mode'u göster
  if (!mounted) {
    return children
  }

  return <ThemeContext.Provider value={{ darkMode, setDarkMode }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
