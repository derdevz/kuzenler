import { TrendingUp } from "lucide-react"

export default function BalanceCard() {
  return (
    <div className="neon-border rounded-xl p-8 bg-slate-900/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-200">XLM Balance</h2>
        <div className="p-2 rounded-lg bg-purple-600/20">
          <TrendingUp className="w-5 h-5 text-purple-400" />
        </div>
      </div>

      {/* Balance Display */}
      <div className="mb-8">
        <div className="text-sm text-slate-400 mb-2">Total Balance</div>
        <div className="text-5xl font-bold text-white mb-2">
          1,250.50 <span className="text-3xl text-purple-400 ml-2">XLM</span>
        </div>
        <div className="text-sm text-green-400 font-semibold">↑ +12.5% this month</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-purple-500/20">
        <div>
          <div className="text-xs text-slate-400 mb-2">Available</div>
          <div className="text-lg font-bold text-white">1,200 XLM</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-2">Locked</div>
          <div className="text-lg font-bold text-slate-400">50.50 XLM</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-2">APY</div>
          <div className="text-lg font-bold text-purple-400">0.50%</div>
        </div>
      </div>
    </div>
  )
}
