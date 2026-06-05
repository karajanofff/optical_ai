import { Activity, ArrowRight, Eye, EyeOff, LockKeyhole, Sparkles, User } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { OpticalHeroIllustration } from "../components/OpticalHeroIllustration";
import { useAuth } from "../context/AuthContext";

const demoAccounts = [
  { username: "admin", password: "admin123", role: "Admin" },
  { username: "operator", password: "operator123", role: "Operator" }
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
    <div className="login-page relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-6">
      <div className="login-grid pointer-events-none absolute inset-0" />
      <div className="login-glow login-glow-left pointer-events-none absolute" />
      <div className="login-glow login-glow-right pointer-events-none absolute" />

      <div className="relative z-10 w-full max-w-4xl">
        <div className="login-shell overflow-hidden rounded-2xl border border-white/10">
          <div className="grid lg:grid-cols-[1fr_0.95fr]">
            <section className="login-panel-left hidden flex-col justify-center p-6 lg:flex">
              <div className="mb-4 flex items-center gap-3">
                <div className="login-logo flex h-10 w-10 items-center justify-center rounded-xl">
                  <Activity className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Optik AI</p>
                  <p className="text-xs text-slate-400">Monitoring markazi</p>
                </div>
              </div>

              <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                <Sparkles className="h-3 w-3" />
                AI kuzatuv
              </p>
              <h1 className="mt-3 text-2xl font-bold leading-snug text-white">
                Optik tarmoqni real vaqtda boshqaring
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Nosozliklarni aniqlang, anomaliyalarni tuzating va tarmoq holatini kuzating.
              </p>

              <OpticalHeroIllustration compact />
            </section>

            <section className="login-panel-right p-5 sm:p-6">
              <div className="mb-5 lg:mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">Xavfsiz kirish</p>
                <h2 className="mt-1 text-xl font-bold text-white">Boshqaruv markaziga kiring</h2>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.username}
                    className={`rounded-xl border px-3 py-2 text-left transition ${
                      username === account.username
                        ? "border-cyan-400/40 bg-cyan-400/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                    onClick={() => {
                      setUsername(account.username);
                      setPassword(account.password);
                      setError("");
                    }}
                    type="button"
                  >
                    <p className="text-xs font-semibold text-white">{account.role}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-cyan-300">{account.username}</p>
                  </button>
                ))}
              </div>

              <form className="space-y-3" onSubmit={handleLogin}>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-400">Foydalanuvchi nomi</span>
                  <div className="login-input-wrap flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2">
                    <User className="h-4 w-4 shrink-0 text-slate-500" />
                    <input
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="admin yoki operator"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-400">Parol</span>
                  <div className="login-input-wrap flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2">
                    <LockKeyhole className="h-4 w-4 shrink-0 text-slate-500" />
                    <input
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
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
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </label>

                {error ? (
                  <p className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                    {error}
                  </p>
                ) : null}

                <button
                  className="login-submit group flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-950 transition disabled:opacity-60"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Kirilmoqda..." : "Panelga kirish"}
                  {!loading ? <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /> : null}
                </button>
              </form>

              <p className="mt-3 text-center text-[10px] text-slate-500">
                Demo: admin/admin123 · operator/operator123
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
