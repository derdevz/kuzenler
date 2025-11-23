"use client"

import { Package, TrendingUp, Clock, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/context/language-context"

const timelineData = [
  {
    id: "1",
    events: [
      {
        time: "14:32",
        date: "Bugün",
        status: "Paketi teslim aldık",
        location: "İstanbul Merkez",
        icon: "package",
      },
      { time: "16:45", date: "Bugün", status: "Depoda işlendi", location: "Bolu Kargo Merkezi", icon: "trending" },
      {
        time: "Şu an",
        date: "Bugün",
        status: "Yola çıktı",
        location: "Bolu → Ankara",
        icon: "clock",
      },
    ],
  },
  {
    id: "2",
    events: [
      {
        time: "09:15",
        date: "Bugün",
        status: "Paketi teslim aldık",
        location: "İzmir Merkez",
        icon: "package",
      },
      {
        time: "12:20",
        date: "Bugün",
        status: "Şehirlerarası taşıyıcıya teslim",
        location: "İzmir Terminal",
        icon: "trending",
      },
      { time: "Şu an", date: "Bugün", status: "Yolda", location: "Manisa", icon: "clock" },
    ],
  },
  {
    id: "3",
    events: [
      {
        time: "08:00",
        date: "Dün",
        status: "Teslim edildi",
        location: "İzmir Merkez",
        icon: "check",
      },
    ],
  },
]

interface TrackingTimelineProps {
  cargoIndex: number
}

export default function TrackingTimeline({ cargoIndex }: TrackingTimelineProps) {
  const { t } = useLanguage()
  const events = timelineData[cargoIndex].events

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "package":
        return <Package className="w-4 h-4" />
      case "trending":
        return <TrendingUp className="w-4 h-4" />
      case "clock":
        return <Clock className="w-4 h-4" />
      case "check":
        return <CheckCircle2 className="w-4 h-4" />
      default:
        return null
    }
  }

    <div className="neon-border rounded-xl bg-slate-900/40 backdrop-blur-sm p-6">
      <h3 className="text-xl font-bold text-white mb-6">Geçmiş ve Güncellemeler</h3>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={index} className="flex gap-4">
            {/* Timeline Node */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  index === events.length - 1
                    ? "bg-purple-500/40 border-2 border-purple-500 text-purple-300"
                    : "bg-slate-700/50 border-2 border-slate-600 text-slate-400"
                }`}
              >
                {getIcon(event.icon)}
              </div>
              {index < events.length - 1 && (
                <div className="w-0.5 h-8 bg-gradient-to-b from-slate-600 to-slate-700 my-1" />
              )}
            </div>

            {/* Event Details */}
            <div className="flex-1 pb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-white">{event.time}</span>
                <span className="text-xs text-slate-500">{event.date}</span>
              </div>
              <p className={`font-semibold mb-1 ${index === events.length - 1 ? "text-purple-400" : "text-slate-200"}`}>
                {event.status}
              </p>
              <p className="text-sm text-slate-400">{event.location}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Son Bilgilendirme</p>
          <p className="text-sm text-purple-300">{t("tracking.message")}</p>
        </div>
      </div>
    </div>
}
