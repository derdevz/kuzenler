"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/context/language-context"

interface PaymentConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: number
  quantity: number
  productName: string
  customerBalance: number | null
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export default function PaymentConfirmation({
  open,
  onOpenChange,
  amount,
  quantity,
  productName,
  customerBalance,
  onConfirm,
  onCancel,
}: PaymentConfirmationProps) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalCost = amount * quantity
  const hasBalance = (customerBalance ?? 0) >= totalCost

  const handleConfirm = async () => {
    setLoading(true)
    setError(null)
    try {
      await onConfirm()
      setLoading(false)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("payment.insufficient"))
      setLoading(false)
    }
  }

  const handleCancel = () => {
    onCancel()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-purple-500/30 bg-slate-900 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            {t("payment.title")}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {t("payment.unitPrice")} × {t("payment.quantity")} = {t("payment.totalCost")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Product Info */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
            <p className="text-sm text-slate-400 mb-2">{t("portal.productName")}</p>
            <p className="text-white font-semibold">{productName}</p>
            <p className="text-sm text-slate-400 mt-2">{t("payment.quantity")}: {quantity}</p>
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">{t("payment.unitPrice")}:</span>
              <span className="text-white font-semibold">{amount.toFixed(7)} XLM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">{t("payment.quantity")}:</span>
              <span className="text-white">{quantity}x</span>
            </div>
            <div className="border-t border-purple-500/20 pt-2 flex justify-between items-center">
              <span className="text-slate-300 font-semibold">{t("payment.totalCost")}:</span>
              <span className="text-xl font-bold text-purple-400">{totalCost.toFixed(7)} XLM</span>
            </div>
          </div>

          {/* Balance Check */}
          <div
            className={`rounded-lg p-4 flex items-start gap-3 ${
              hasBalance
                ? "bg-emerald-900/20 border border-emerald-500/30"
                : "bg-red-900/20 border border-red-500/30"
            }`}
          >
            {hasBalance ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-semibold ${hasBalance ? "text-emerald-300" : "text-red-300"}`}>
                {hasBalance ? t("payment.currentBalance") : t("payment.insufficient")}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                {t("payment.currentBalance")}: {(customerBalance ?? 0).toFixed(7)} XLM
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Info Text */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/20">
            <p className="text-xs text-slate-400">
              {t("payment.warning").replace("%amount", totalCost.toFixed(7))}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="border-purple-500/30 text-purple-300 hover:bg-purple-600/10"
          >
            {t("payment.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!hasBalance || loading}
            className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "İşleniyor..." : t("payment.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
