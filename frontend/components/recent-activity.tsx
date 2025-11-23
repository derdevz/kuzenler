import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react"

interface ActivityItem {
  id: string
  type: "send" | "receive"
  amount: string
  address: string
  timestamp: string
  status: "completed" | "pending"
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    type: "send",
    amount: "100.00 XLM",
    address: "GBVF...QQY8",
    timestamp: "2 hours ago",
    status: "completed",
  },
  {
    id: "2",
    type: "receive",
    amount: "50.25 XLM",
    address: "GBUQ...LH2X",
    timestamp: "1 day ago",
    status: "completed",
  },
  {
    id: "3",
    type: "send",
    amount: "25.50 XLM",
    address: "GCAK...9F8S",
    timestamp: "3 days ago",
    status: "completed",
  },
  {
    id: "4",
    type: "receive",
    amount: "200.00 XLM",
    address: "GDZM...Y4P2",
    timestamp: "1 week ago",
    status: "completed",
  },
]

export default function RecentActivity() {
  return (
    <div className="neon-border rounded-xl p-8 bg-slate-900/50 backdrop-blur-sm">
      {/* Header */}
      <h2 className="text-lg font-semibold text-slate-200 mb-6">Recent Activity</h2>

      {/* Activity List */}
      <div className="space-y-4">
        {MOCK_ACTIVITIES.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-purple-500/10 hover:border-purple-500/30 transition-colors"
          >
            {/* Left - Icon & Details */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Icon */}
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  activity.type === "send" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                }`}
              >
                {activity.type === "send" ? (
                  <ArrowUpRight className="w-5 h-5" />
                ) : (
                  <ArrowDownLeft className="w-5 h-5" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white capitalize">
                    {activity.type === "send" ? "Sent to" : "Received from"}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 flex-shrink-0">
                    {activity.status}
                  </span>
                </div>
                <span className="text-sm text-slate-400 font-mono truncate">{activity.address}</span>
              </div>
            </div>

            {/* Right - Amount & Time */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
              <span className={`font-semibold ${activity.type === "send" ? "text-red-400" : "text-green-400"}`}>
                {activity.type === "send" ? "-" : "+"}
                {activity.amount}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                {activity.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <button className="w-full mt-6 py-3 text-center text-purple-400 hover:text-purple-300 font-semibold text-sm rounded-lg hover:bg-purple-500/10 transition-colors">
        View All Transactions
      </button>
    </div>
  )
}
