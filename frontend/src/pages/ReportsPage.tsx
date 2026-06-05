import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { devicesApi, reportsApi } from "../services/api";
import type { Device, SummaryReport } from "../types";

export function ReportsPage() {
  const [summary, setSummary] = useState<SummaryReport | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    reportsApi.summary().then(setSummary);
    devicesApi.list().then(setDevices);
  }, []);

  const chartData = useMemo(
    () =>
      devices.map((device) => ({
        name: device.name,
        latency: device.latency,
        loss: device.packet_loss,
        temperature: device.temperature
      })),
    [devices]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Kunlik ogohlantirishlar", summary?.alerts_today ?? 0],
          ["Haftalik ogohlantirishlar", summary?.alerts_this_week ?? 0],
          ["O'rtacha signal", `${summary?.average_signal ?? 0} dBm`],
          ["O'rtacha paket yo'qotilishi", `${summary?.average_packet_loss ?? 0}%`]
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-premium backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-semibold text-white">Tarmoq holati umumiy ko'rinishi</h2>
          <p className="text-sm text-slate-400">Kunlik va haftalik ko'rsatkichlar jamlanmasi</p>
        </div>
        <div className="mt-6 h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ background: "#0f172a", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)" }} />
              <Bar dataKey="latency" fill="#60a5fa" radius={[12, 12, 0, 0]} />
              <Bar dataKey="loss" fill="#f59e0b" radius={[12, 12, 0, 0]} />
              <Bar dataKey="temperature" fill="#2dd4bf" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
