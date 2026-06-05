import { Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { SeverityBadge } from "../components/SeverityBadge";
import { StatusBadge } from "../components/StatusBadge";
import { aiApi, devicesApi } from "../services/api";
import type { Device, DeviceMetric, PredictionResult } from "../types";

export function DeviceDetailsPage() {
  const params = useParams();
  const [device, setDevice] = useState<Device | null>(null);
  const [metrics, setMetrics] = useState<DeviceMetric[]>([]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const loadDevice = async (id: number) => {
    const data = await devicesApi.get(id);
    setDevice(data);
    const nextPrediction = await aiApi.predict({
      signal_strength: data.signal_strength,
      latency: data.latency,
      packet_loss: data.packet_loss,
      traffic_load: data.traffic_load,
      uptime: data.uptime,
      temperature: data.temperature
    });
    setPrediction(nextPrediction);
    const metricData = await devicesApi.metrics(id);
    setMetrics(metricData.reverse());
  };

  useEffect(() => {
    loadDevice(Number(params.id)).catch(() => undefined);
  }, [params.id]);

  const chartData = useMemo(
    () =>
      metrics.map((item) => ({
        time: new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        signal: item.signal_strength,
        latency: item.latency,
        loss: item.packet_loss
      })),
    [metrics]
  );

  const predictionLabel =
    prediction?.prediction === "normal"
      ? "Normal"
      : prediction?.prediction === "warning"
        ? "Ogohlantirish"
        : prediction?.prediction === "critical"
          ? "Kritik"
          : prediction?.prediction;

  if (!device) {
    return <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">Qurilma yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-premium backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-accent">{device.device_type}</p>
            <h2 className="mt-2 text-3xl font-bold text-white">{device.name}</h2>
            <p className="mt-2 text-slate-400">
              {device.location} - {device.ip_address}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={device.status} />
            {prediction ? <SeverityBadge severity={prediction.prediction} /> : null}
            {device.status !== "online" ? (
              <button
                className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-60"
                disabled={isResolving}
                onClick={async () => {
                  setIsResolving(true);
                  try {
                    await devicesApi.resolve(device.id);
                    await loadDevice(device.id);
                  } finally {
                    setIsResolving(false);
                  }
                }}
                type="button"
              >
                <Wrench className="h-4 w-4" />
                {isResolving ? "Tuzatilmoqda..." : "Tuzatildi deb belgilash"}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-premium backdrop-blur-xl">
          <h3 className="text-xl font-semibold text-white">Metrikalar tarixi</h3>
          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: "#94a3b8" }} />
                <YAxis tick={{ fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ background: "#0f172a", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)" }} />
                <Line type="monotone" dataKey="signal" stroke="#2dd4bf" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="latency" stroke="#60a5fa" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="loss" stroke="#f59e0b" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-premium backdrop-blur-xl">
          <h3 className="text-xl font-semibold text-white">Qurilma profili</h3>
          <div className="mt-6 grid gap-3">
            {[
              ["Signal kuchi", `${device.signal_strength} dBm`],
              ["Kechikish", `${device.latency} ms`],
              ["Paket yo'qotilishi", `${device.packet_loss}%`],
              ["Trafik yuklamasi", `${device.traffic_load} Mbps`],
              ["Harorat", `${device.temperature} C`],
              ["Ish vaqti", `${device.uptime} soat`]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span className="text-slate-400">{label}</span>
                <span className="font-semibold text-white">{value}</span>
              </div>
            ))}
            {prediction ? (
              <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4">
                <p className="text-sm text-slate-300">AI bashorati</p>
                <p className="mt-2 text-xl font-semibold text-white">{predictionLabel}</p>
                <p className="mt-1 text-sm text-slate-400">Ishonchlilik: {(prediction.confidence * 100).toFixed(1)}%</p>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
