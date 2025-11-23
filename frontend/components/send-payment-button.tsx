"use client"

import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SendPaymentButtonProps {
  onClick: () => void
}

export default function SendPaymentButton({ onClick }: SendPaymentButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/50 neon-glow text-lg"
    >
      <Send className="w-5 h-5 mr-2" />
      Send Payment
    </Button>
  )
}
