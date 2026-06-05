import { Activity, AlertTriangle, Network, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { SeverityBadge } from "../components/SeverityBadge";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { useLiveMetrics } from "../hooks/useLiveMetrics";
import { alertsApi, devicesApi, reportsApi } from "../services/api";
import type { AlertItem, Device, SummaryReport } from "../types";

export function DashboardPage() {
  const [summary, setSummary] = useState<SummaryReport | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const { metrics, connected } = useLiveMetrics();

  useEffect(() => {
    const loadData = () => {
      reportsApi.summary().then(setSummary).catch(() => undefined);
      devicesApi.list().then(setDevices).catch(() => undefined);
      alertsApi.list().then((data) => setAlerts(data.slice(0, 5))).catch(() => undefined);
    };

    loadData();
    const intervalId = window.setInterval(loadData, 10000);
    return () => window.clearInterval(intervalId);
  }, []);

  const chartData = useMemo(
    () =>
      metrics.map((item) => ({
        name: item.device_name,
        signal: item.signal_strength,
        traffic: item.traffic_load,
        loss: item.packet_loss,
        latency: item.latency
      })),
    [metrics]
  );

  const statusDistribution = useMemo(
    () => [
      { name: "Onlayn", value: summary?.online_devices ?? 0, fill: "#34d399" },
      { name: "Ogohlantirish", value: summary?.warning_devices ?? 0, fill: "#f59e0b" },
      { name: "Oflayn", value: summary?.offline_devices ?? 0, fill: "#f43f5e" }
    ],
    [summary]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-4">
        <StatCard title="Jami qurilmalar" value={summary?.total_devices ?? devices.length} subtitle="Ulangan optik qurilmalar soni" icon={Network} />
        <StatCard title="Anomaliyalar" value={summary?.anomaly_count ?? 0} subtitle="AI aniqlagan xavfli holatlar" icon={AlertTriangle} />
        <StatCard title="Sog'liq indeksi" value={`${summary?.health_score ?? 0}%`} subtitle="Tarmoqning umumiy holat ko'rsatkichi" icon={ShieldCheck} />
        <StatCard title="Jonli telemetriya" value={connected ? "Ulangan" : "Kuzatilmoqda"} subtitle="Real vaqt ulanish holati" icon={Activity} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-premium backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Trafik va signal tahlili</h2>
              <p className="text-sm text-slate-400">Jonli optik trafik va qabul qilingan signal kuchi</p>
            </div>
            <div className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Oqim faol
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="trafficFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="signalFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#0f172a", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)" }} />
                <Area type="monotone" dataKey="traffic" name="Trafik Mbps" stroke="#2dd4bf" fill="url(#trafficFill)" strokeWidth={3} />
                <Area type="monotone" dataKey="signal" name="Signal dBm" stroke="#60a5fa" fill="url(#signalFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-premium backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white">Qurilmalar holati</h2>
          <p className="mt-1 text-sm text-slate-400">Tugunlar bo'yicha ish holati taqsimoti</p>
          <div className="mt-6 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDistribution} dataKey="value" innerRadius={72} outerRadius={100} paddingAngle={4} />
                <Tooltip contentStyle={{ background: "#0f172a", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {statusDistribution.map((item) => (
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3" key={item.name}>
                <span className="text-sm text-slate-300">{item.name}</span>
                <span className="font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-premium backdrop-blur-xl">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">Kechikish grafigi</h2>
            <p className="text-sm text-slate-400">Millisekundlarda o'lchangan tarmoq kechikishi</p>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#0f172a", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)" }} />
                <Line type="monotone" dataKey="latency" name="Kechikish ms" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-premium backdrop-blur-xl">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">Paket yo'qotilishi grafigi</h2>
            <p className="text-sm text-slate-400">Kuzatilayotgan qurilmalardagi yo'qotish ulushi</p>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#0f172a", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)" }} />
                <Bar dataKey="loss" name="Paket yo'qotilishi %" fill="#f59e0b" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-premium backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white">So'nggi AI ogohlantirishlari</h2>
          <div className="mt-5 space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{alert.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{alert.message}</p>
                  </div>
                  <SeverityBadge severity={alert.severity} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-premium backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white">Qurilmalar holati</h2>
          <div className="mt-5 space-y-3">
            {devices.slice(0, 5).map((device) => (
              <div key={device.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="font-semibold text-white">{device.name}</p>
                  <p className="text-sm text-slate-400">{device.location}</p>
                </div>
                <StatusBadge status={device.status} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
