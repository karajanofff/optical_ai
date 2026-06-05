import { ArrowRight, ChevronRight, Eye, EyeOff, Headphones, LockKeyhole, User } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const demoAccounts = [
  { username: "admin", password: "admin123", role: "Admin" },
  { username: "operator", password: "operator123", role: "Operator" }
];

function PortalLogo() {
  return (
    <svg className="h-11 w-11 shrink-0" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="18" cy="24" r="11" stroke="#107C6E" strokeWidth="3" />
      <circle cx="30" cy="24" r="11" stroke="#107C6E" strokeWidth="3" />
      <circle cx="24" cy="14" r="9" stroke="#107C6E" strokeWidth="3" />
    </svg>
  );
}

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

  const quickLogin = async (account: (typeof demoAccounts)[number]) => {
    setUsername(account.username);
    setPassword(account.password);
    setError("");
    setLoading(true);
    try {
      await login(account.username, account.password);
      navigate("/");
    } catch {
      setError("Kirish amalga oshmadi. Login va parolni tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-portal min-h-screen">
      <header className="login-portal-header border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <PortalLogo />
            <div>
              <p className="text-sm font-semibold text-slate-800 sm:text-base">Optik AI Monitoring markazi</p>
              <p className="hidden text-xs text-slate-500 sm:block">Tolali tarmoq boshqaruv tizimi</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden items-center gap-2 text-sm text-slate-600 sm:flex">
              <span className="login-portal-dot h-2 w-2 rounded-full bg-emerald-500" />
              <span>Call center</span>
              <span className="font-medium text-emerald-600">online</span>
              <span className="text-slate-400">24/7</span>
            </div>
            <a
              className="login-portal-call flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white sm:px-4"
              href="tel:1195"
            >
              <Headphones className="h-4 w-4" />
              <span className="hidden sm:inline">Qo'llab-quvvatlash</span>
              <span>1195</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <span>Asosiy sahifa</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-slate-700">Kirish</span>
        </nav>

        <div className="login-portal-card mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 md:p-10">
          <h1 className="text-3xl font-bold text-slate-800">Kirish</h1>
          <p className="mt-2 text-sm text-slate-600">
            Yangi foydalanuvchimisiz?{" "}
            <span className="font-medium text-[#107C6E]">Demo akkauntlardan foydalaning</span>
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Foydalanuvchi nomi</span>
              <div className="login-portal-input flex overflow-hidden rounded-lg border border-slate-300 bg-white">
                <span className="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-sm text-slate-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  className="w-full px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="admin yoki operator"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Parol</span>
              <div className="login-portal-input flex items-center overflow-hidden rounded-lg border border-slate-300 bg-white">
                <input
                  className="w-full px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Parolni kiriting"
                />
                <button
                  className="px-4 text-slate-400 transition hover:text-slate-600"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </label>

            {error ? (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
            ) : null}

            <div className="flex flex-col-reverse items-stretch justify-between gap-4 pt-1 sm:flex-row sm:items-center">
              <button
                className="flex items-center justify-center gap-2 text-sm font-medium text-[#107C6E] transition hover:text-[#0d6659] sm:justify-start"
                type="button"
              >
                <LockKeyhole className="h-4 w-4" />
                Parolni tiklash
              </button>
              <button
                className="login-portal-submit flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
                disabled={loading}
                type="submit"
              >
                {loading ? "Kirilmoqda..." : "Kirish"}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </div>
          </form>

          <div className="login-portal-divider my-8" />

          <p className="mb-4 text-center text-sm text-slate-600">Tezkor kirish uchun rolni tanlang</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {demoAccounts.map((account) => (
              <button
                key={account.username}
                className="login-portal-alt flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
                disabled={loading}
                onClick={() => quickLogin(account)}
                type="button"
              >
                {account.role} sifatida kirish
                <ArrowRight className="h-4 w-4" />
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Demo: admin / admin123 · operator / operator123
          </p>
        </div>
      </main>

      <button
        className="login-portal-fab fixed bottom-6 right-6 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
        type="button"
      >
        <span className="text-lg leading-none">✦</span>
        Monitoring
      </button>
    </div>
  );
}
