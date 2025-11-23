"use client"

import { useEffect, useState } from "react"

export function useAdminAuth() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if admin session exists in localStorage
    const adminSession = localStorage.getItem("admin-session")
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession)
        if (session.isAdmin) {
          setIsAdminAuthenticated(true)
        }
      } catch (e) {
        setIsAdminAuthenticated(false)
      }
    }
    setIsLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem("admin-session")
    setIsAdminAuthenticated(false)
  }

  return {
    isAdminAuthenticated,
    isLoading,
    logout,
  }
}
