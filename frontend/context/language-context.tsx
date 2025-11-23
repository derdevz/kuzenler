"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations } from "@/lib/i18n"

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState("tr")

  useEffect(() => {
    const saved = localStorage.getItem("kuzenler-language")
    if (saved) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: string) => {
    setLanguageState(lang)
    localStorage.setItem("kuzenler-language", lang)
  }

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.tr] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
