import { useEffect, useState } from "react";

import { AlertRecommendations } from "../components/AlertRecommendations";
import { SeverityBadge } from "../components/SeverityBadge";
import { alertsApi, devicesApi } from "../services/api";
import type { AlertItem } from "../types";

export function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const loadAlerts = async () => {
    const data = await alertsApi.list();
    setAlerts(data);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-premium backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Ogohlantirishlar va hodisalar</h2>
          <p className="text-sm text-slate-400">AI yaratgan anomaliyalar va operator ko'rib chiqish navbati</p>
        </div>
      </div>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <article key={alert.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-white">{alert.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{alert.message}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">
                  {new Date(alert.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <SeverityBadge severity={alert.severity} />
                <button
                  className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
                  onClick={async () => {
                    await alertsApi.markRead(alert.id, !alert.is_read);
                    await loadAlerts();
                  }}
                  type="button"
                >
                  {alert.is_read ? "O'qilmagan qilish" : "Ko'rib chiqildi"}
                </button>
              </div>
            </div>
            {!alert.is_read ? (
              <AlertRecommendations
                alert={alert}
                onResolve={async () => {
                  await devicesApi.resolve(alert.device_id);
                  await loadAlerts();
                }}
              />
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
