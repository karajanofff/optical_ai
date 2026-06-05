import { Activity, Cpu, Waves } from "lucide-react";

import { SeverityBadge } from "../components/SeverityBadge";
import { StatusBadge } from "../components/StatusBadge";
import { useLiveMetrics } from "../hooks/useLiveMetrics";

export function MonitoringPage() {
  const { metrics, connected } = useLiveMetrics();

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-premium backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Real vaqt monitoring paneli</h2>
            <p className="text-sm text-slate-400">Bir necha soniyada yangilanadigan simulyatsion optik telemetriya</p>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
            <Activity className="h-4 w-4" />
            {connected ? "WebSocket ulandi" : "Qayta ulanmoqda"}
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {metrics.map((metric) => (
          <article key={metric.device_id} className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-premium backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-accent">{metric.device_name}</p>
                <p className="mt-2 text-sm text-slate-400">Yangilandi: {new Date(metric.timestamp).toLocaleTimeString()}</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={metric.status} />
                <SeverityBadge severity={metric.ai_state} />
              </div>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {[
                { icon: Waves, label: "Signal", value: `${metric.signal_strength} dBm` },
                { icon: Cpu, label: "Kechikish", value: `${metric.latency} ms` },
                { icon: Cpu, label: "Paket yo'qotilishi", value: `${metric.packet_loss}%` },
                { icon: Cpu, label: "Trafik", value: `${metric.traffic_load} Mbps` },
                { icon: Cpu, label: "Ish vaqti", value: `${metric.uptime} soat` },
                { icon: Cpu, label: "Harorat", value: `${metric.temperature} C` }
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{label}</span>
                  </div>
                  <p className="mt-2 text-xl font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
