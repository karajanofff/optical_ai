import { Activity, ArrowRight, Eye, EyeOff, LockKeyhole, Shield, Sparkles, User, Zap } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { OpticalHeroIllustration } from "../components/OpticalHeroIllustration";
import { useAuth } from "../context/AuthContext";

const demoAccounts = [
  { username: "admin", password: "admin123", role: "Admin", desc: "To'liq boshqaruv" },
  { username: "operator", password: "operator123", role: "Operator", desc: "Kuzatuv va tuzatish" }
];

const features = [
  { icon: Activity, label: "Jonli telemetriya", color: "text-emerald-300" },
  { icon: Sparkles, label: "AI tasnifi", color: "text-cyan-300" },
  { icon: Shield, label: "Xavfsiz kirish", color: "text-blue-300" },
  { icon: Zap, label: "Real vaqt ogohlantirish", color: "text-amber-300" }
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch {
      setError("Kirish amalga oshmadi. Login va parolni tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page relative min-h-screen overflow-hidden">
      <div className="login-grid pointer-events-none absolute inset-0" />
      <div className="login-glow login-glow-left pointer-events-none absolute" />
      <div className="login-glow login-glow-right pointer-events-none absolute" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 lg:px-8 lg:py-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="login-logo flex h-14 w-14 items-center justify-center rounded-2xl">
              <Activity className="h-7 w-7 text-cyan-300" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">Optik AI</p>
              <p className="text-sm text-slate-400">Monitoring markazi</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200 md:flex">
            <span className="login-pulse h-2 w-2 rounded-full bg-emerald-400" />
            Tizim faol
          </div>
        </header>

        <div className="flex flex-1 items-center">
          <div className="login-shell grid w-full overflow-hidden rounded-[32px] border border-white/10 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="login-panel-left relative hidden flex-col justify-between p-8 lg:flex lg:p-10">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI yordamidagi kuzatuv
                </p>
                <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                  Optik tarmoqni real vaqtda boshqaring
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
                  Nosozliklarni oldindan aniqlang, anomaliyalarni tuzating va tarmoq sog'lig'ini bir paneldan nazorat qiling.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {features.map(({ icon: Icon, label, color }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 backdrop-blur-sm"
                    >
                      <Icon className={`h-5 w-5 ${color}`} />
                      <p className="mt-2 text-sm font-medium text-slate-200">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <OpticalHeroIllustration />
            </section>

            <section className="login-panel-right flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-8 lg:hidden">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Optik AI Monitoring</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Boshqaruv markaziga kiring</h2>
                </div>

                <div className="hidden lg:block">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Xavfsiz kirish</p>
                  <h2 className="mt-3 text-3xl font-bold text-white">Boshqaruv markaziga kiring</h2>
                  <p className="mt-3 text-sm text-slate-400">Hisobingiz bilan tizimga ulaning</p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.username}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        username === account.username
                          ? "border-cyan-400/40 bg-cyan-400/10"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                      }`}
                      onClick={() => {
                        setUsername(account.username);
                        setPassword(account.password);
                        setError("");
                      }}
                      type="button"
                    >
                      <p className="text-sm font-semibold text-white">{account.role}</p>
                      <p className="mt-1 text-xs text-slate-400">{account.desc}</p>
                      <p className="mt-2 font-mono text-xs text-cyan-300">{account.username}</p>
                    </button>
                  ))}
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleLogin}>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-300">Foydalanuvchi nomi</span>
                    <div className="login-input-wrap flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                      <User className="h-5 w-5 shrink-0 text-slate-500" />
                      <input
                        className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="admin yoki operator"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-300">Parol</span>
                    <div className="login-input-wrap flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                      <LockKeyhole className="h-5 w-5 shrink-0 text-slate-500" />
                      <input
                        className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Parolni kiriting"
                      />
                      <button
                        className="text-slate-500 transition hover:text-slate-300"
                        onClick={() => setShowPassword((current) => !current)}
                        type="button"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </label>

                  {error ? (
                    <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {error}
                    </p>
                  ) : null}

                  <button
                    className="login-submit group flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 font-semibold text-slate-950 transition disabled:opacity-60"
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? "Kirilmoqda..." : "Panelga kirish"}
                    {!loading ? <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" /> : null}
                  </button>
                </form>

                <p className="mt-6 text-center text-xs text-slate-500">
                  Demo: <span className="text-slate-400">admin / admin123</span> ·{" "}
                  <span className="text-slate-400">operator / operator123</span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
