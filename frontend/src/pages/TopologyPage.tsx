import { Cable, MapPinned, Route, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SeverityBadge } from "../components/SeverityBadge";
import { topologyApi } from "../services/api";
import type { OpticalLine } from "../types";

const toneLabel: Record<string, string> = {
  healthy: "Barqaror",
  warning: "Ogohlantirish",
  critical: "Kritik"
};

const toneStyle: Record<string, string> = {
  healthy: "border-emerald-400/20 bg-emerald-400/10",
  warning: "border-amber-400/20 bg-amber-400/10",
  critical: "border-rose-400/20 bg-rose-400/10"
};

export function TopologyPage() {
  const [lines, setLines] = useState<OpticalLine[]>([]);

  useEffect(() => {
    topologyApi.lines().then(setLines).catch(() => undefined);
  }, []);

  const summary = useMemo(
    () => ({
      totalLines: lines.length,
      totalDistance: lines.reduce((acc, item) => acc + item.length_km, 0),
      warningLines: lines.filter((item) => item.status === "warning").length,
      criticalLines: lines.filter((item) => item.status === "critical").length
    }),
    [lines]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-premium backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Network topology</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Optik liniya yo‘nalishlari</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Har bir optik liniya qaysi tugundan qaysi tugunga ketayotgani, masofa, signal yo‘qotilishi va foydalanish darajasi bilan birga ko‘rsatiladi.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
            Source → Target optik yo‘nalishlar
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-4">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5 shadow-premium backdrop-blur-xl">
          <div className="flex items-center gap-3 text-accent">
            <Cable className="h-5 w-5" />
            <span className="text-sm">Jami liniyalar</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">{summary.totalLines}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5 shadow-premium backdrop-blur-xl">
          <div className="flex items-center gap-3 text-accent">
            <Route className="h-5 w-5" />
            <span className="text-sm">Umumiy masofa</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">{summary.totalDistance.toFixed(1)} km</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5 shadow-premium backdrop-blur-xl">
          <div className="flex items-center gap-3 text-amber-300">
            <MapPinned className="h-5 w-5" />
            <span className="text-sm">Warning liniyalar</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">{summary.warningLines}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5 shadow-premium backdrop-blur-xl">
          <div className="flex items-center gap-3 text-rose-300">
            <TriangleAlert className="h-5 w-5" />
            <span className="text-sm">Critical liniyalar</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">{summary.criticalLines}</p>
        </div>
      </div>

      <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-premium backdrop-blur-xl">
        <h3 className="text-xl font-semibold text-white">Liniyalar ro‘yxati va yo‘nalishlar</h3>
        <div className="mt-6 space-y-4">
          {lines.map((line) => (
            <article key={line.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{line.name}</h4>
                  <p className="mt-1 text-sm text-slate-300">
                    {line.source_device_name} <span className="px-2 text-accent">→</span> {line.target_device_name}
                  </p>
                </div>
                <SeverityBadge severity={line.status === "critical" ? "critical" : line.status === "warning" ? "warning" : "info"} />
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                <div className="rounded-2xl bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Fiber type</p>
                  <p className="mt-2 text-sm font-semibold text-white">{line.fiber_type}</p>
                </div>
                <div className="rounded-2xl bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Length</p>
                  <p className="mt-2 text-sm font-semibold text-white">{line.length_km} km</p>
                </div>
                <div className="rounded-2xl bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Attenuation</p>
                  <p className="mt-2 text-sm font-semibold text-white">{line.attenuation_db} dB</p>
                </div>
                <div className="rounded-2xl bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Signal loss</p>
                  <p className="mt-2 text-sm font-semibold text-white">{line.signal_loss_db} dB</p>
                </div>
                <div className="rounded-2xl bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Utilization</p>
                  <p className="mt-2 text-sm font-semibold text-white">{line.utilization_percent}%</p>
                </div>
                <div className="rounded-2xl bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Last update</p>
                  <p className="mt-2 text-sm font-semibold text-white">{line.last_update_time}</p>
                </div>
              </div>

              <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${toneStyle[line.status] ?? "border-white/10 bg-white/5"}`}>
                <span className="text-slate-200">Holat: </span>
                <span className="font-semibold text-white">{toneLabel[line.status] ?? line.status}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
