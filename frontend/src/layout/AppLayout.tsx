import { Bell, Gauge, LayoutDashboard, LogOut, Monitor, Router, ScrollText } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Boshqaruv paneli", icon: LayoutDashboard },
  { to: "/devices", label: "Qurilmalar", icon: Router },
  { to: "/topology", label: "Topologiya", icon: Router },
  { to: "/monitoring", label: "Kuzatuv", icon: Monitor },
  { to: "/alerts", label: "Ogohlantirishlar", icon: Bell },
  { to: "/reports", label: "Hisobotlar", icon: ScrollText }
];

export function AppLayout() {
  const { logout, role, username } = useAuth();

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 p-4 lg:p-6">
        <aside className="hidden w-72 shrink-0 rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-premium backdrop-blur-xl lg:flex lg:flex-col">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-accent/15 p-3 text-accent">
              <Gauge className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Optik AI</p>
              <p className="text-sm text-slate-400">Monitoring markazi</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                    isActive ? "bg-accent text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-10">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Faol profil</p>
              <p className="mt-2 text-lg font-semibold text-white">{username}</p>
              <p className="text-sm uppercase tracking-[0.2em] text-accent">
                {role === "admin" ? "ADMIN" : role === "operator" ? "OPERATOR" : role}
              </p>
            </div>
            <button
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-slate-200 transition hover:bg-white/5"
              onClick={logout}
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Chiqish
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <nav className="mb-4 flex gap-2 overflow-x-auto rounded-[24px] border border-white/10 bg-slate-950/60 p-2 shadow-premium backdrop-blur-xl lg:hidden">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex min-w-fit items-center gap-2 rounded-2xl px-4 py-3 text-sm transition ${
                    isActive ? "bg-accent text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <header className="mb-6 rounded-[28px] border border-white/10 bg-slate-950/60 px-6 py-5 shadow-premium backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-accent">Optik tarmoq intellekti</p>
                <h1 className="mt-2 text-2xl font-bold text-white">Tolali tarmoq boshqaruv markazi</h1>
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                Jonli telemetriya va AI tasnifi
              </div>
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
