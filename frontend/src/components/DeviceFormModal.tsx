import { useEffect, useState } from "react";

import type { Device } from "../types";

interface DeviceFormModalProps {
  device?: Device | null;
  onClose: () => void;
  onSubmit: (payload: Omit<Device, "id">) => Promise<void>;
}

const initialForm: Omit<Device, "id"> = {
  name: "",
  device_type: "OLT",
  location: "",
  ip_address: "",
  status: "online",
  signal_strength: -18,
  latency: 2,
  packet_loss: 0.1,
  traffic_load: 240,
  uptime: 720,
  temperature: 34
};

const fields: Array<{ key: keyof Omit<Device, "id">; type: "text" | "number" }> = [
  { key: "name", type: "text" },
  { key: "device_type", type: "text" },
  { key: "location", type: "text" },
  { key: "ip_address", type: "text" },
  { key: "status", type: "text" },
  { key: "signal_strength", type: "number" },
  { key: "latency", type: "number" },
  { key: "packet_loss", type: "number" },
  { key: "traffic_load", type: "number" },
  { key: "uptime", type: "number" },
  { key: "temperature", type: "number" }
];

const fieldLabels: Record<keyof Omit<Device, "id">, string> = {
  name: "Nomi",
  device_type: "Turi",
  location: "Joylashuvi",
  ip_address: "IP manzil",
  status: "Holati",
  signal_strength: "Signal kuchi",
  latency: "Kechikish",
  packet_loss: "Paket yo'qotilishi",
  traffic_load: "Trafik yuklamasi",
  uptime: "Ish vaqti",
  temperature: "Harorat"
};

export function DeviceFormModal({ device, onClose, onSubmit }: DeviceFormModalProps) {
  const [form, setForm] = useState<Omit<Device, "id">>(initialForm);

  useEffect(() => {
    if (device) {
      const { id, ...rest } = device;
      setForm(rest);
      return;
    }
    setForm(initialForm);
  }, [device]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-900/90 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">{device ? "Qurilmani tahrirlash" : "Qurilma qo'shish"}</h3>
          <button className="text-slate-400 hover:text-white" onClick={onClose} type="button">
            Yopish
          </button>
        </div>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit(form);
            onClose();
          }}
        >
          {fields.map(({ key, type }) => (
            <label key={key} className="text-sm text-slate-300">
              <span className="mb-2 block capitalize">{fieldLabels[key]}</span>
              {key === "status" ? (
                <select
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0"
                  value={form.status}
                  onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
                >
                  <option value="online">Onlayn</option>
                  <option value="warning">Ogohlantirish</option>
                  <option value="offline">Oflayn</option>
                </select>
              ) : (
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0"
                  type={type}
                  step="any"
                  value={form[key]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [key]: type === "number" ? Number(event.target.value) : event.target.value
                    }) as Omit<Device, "id">)
                  }
                />
              )}
            </label>
          ))}
          <div className="md:col-span-2 flex justify-end gap-3">
            <button className="rounded-2xl border border-white/10 px-5 py-3 text-slate-200" onClick={onClose} type="button">
              Bekor qilish
            </button>
            <button className="rounded-2xl bg-accent px-5 py-3 font-semibold text-slate-950" type="submit">
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
