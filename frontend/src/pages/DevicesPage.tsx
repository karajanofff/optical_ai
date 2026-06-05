import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { DeviceFormModal } from "../components/DeviceFormModal";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { devicesApi } from "../services/api";
import type { Device } from "../types";

export function DevicesPage() {
  const { role } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [activeDevice, setActiveDevice] = useState<Device | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadDevices = async () => {
    const data = await devicesApi.list();
    setDevices(data);
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const counts = useMemo(
    () => ({
      online: devices.filter((device) => device.status === "online").length,
      warning: devices.filter((device) => device.status === "warning").length,
      offline: devices.filter((device) => device.status === "offline").length
    }),
    [devices]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Onlayn tugunlar</p>
          <p className="mt-2 text-3xl font-bold text-white">{counts.online}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Ogohlantirishdagi tugunlar</p>
          <p className="mt-2 text-3xl font-bold text-white">{counts.warning}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Oflayn tugunlar</p>
          <p className="mt-2 text-3xl font-bold text-white">{counts.offline}</p>
        </div>
      </div>

      <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-premium backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Optik qurilmalar</h2>
            <p className="text-sm text-slate-400">Kuzatilayotgan tugun va endpointlarni boshqarish</p>
          </div>
          {role === "admin" ? (
            <button
              className="flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 font-semibold text-slate-950"
              onClick={() => {
                setActiveDevice(null);
                setIsModalOpen(true);
              }}
              type="button"
            >
              <Plus className="h-4 w-4" />
              Qurilma qo'shish
            </button>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.25em] text-slate-500">
                <th className="px-4 py-3">Qurilma</th>
                <th className="px-4 py-3">Turi</th>
                <th className="px-4 py-3">Joylashuvi</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">Signal</th>
                <th className="px-4 py-3">Kechikish</th>
                <th className="px-4 py-3">Holati</th>
                <th className="px-4 py-3">Amal</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id} className="border-b border-white/5 text-sm text-slate-200">
                  <td className="px-4 py-4 font-medium text-white">{device.name}</td>
                  <td className="px-4 py-4">{device.device_type}</td>
                  <td className="px-4 py-4">{device.location}</td>
                  <td className="px-4 py-4">{device.ip_address}</td>
                  <td className="px-4 py-4">{device.signal_strength} dBm</td>
                  <td className="px-4 py-4">{device.latency} ms</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={device.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Link className="text-accent" to={`/devices/${device.id}`}>
                        Ko'rish
                      </Link>
                      {role === "admin" ? (
                        <>
                          <button
                            className="text-slate-300"
                            onClick={() => {
                              setActiveDevice(device);
                              setIsModalOpen(true);
                            }}
                            type="button"
                          >
                            Tahrirlash
                          </button>
                          <button
                            className="text-rose-300"
                            onClick={async () => {
                              await devicesApi.remove(device.id);
                              await loadDevices();
                            }}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen ? (
        <DeviceFormModal
          device={activeDevice}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (payload) => {
            if (activeDevice) {
              await devicesApi.update(activeDevice.id, payload);
            } else {
              await devicesApi.create(payload);
            }
            await loadDevices();
          }}
        />
      ) : null}
    </div>
  );
}
