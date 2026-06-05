import { LockKeyhole, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { OpticalHeroIllustration } from "../components/OpticalHeroIllustration";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/75 shadow-premium backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative hidden overflow-hidden p-10 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.2),_transparent_30%)]" />
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.35em] text-accent">AI yordamidagi tolali tarmoq kuzatuvi</p>
            <h1 className="mt-6 max-w-xl text-5xl font-bold leading-tight text-white">
              Optik tarmoq holatini real vaqt rejimida kuzatish va nosozlikni oldindan aniqlash.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-slate-300">
              Premium monitoring markazi, AI tasnifi, jonli telemetriya va operatorlar uchun qulay boshqaruv paneli.
            </p>
            <OpticalHeroIllustration />
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Xavfsiz kirish</p>
          <h2 className="mt-4 text-3xl font-bold text-white">Boshqaruv markaziga kiring</h2>
          <p className="mt-3 text-sm text-slate-400">Demo akkauntlar: admin/admin123 va operator/operator123</p>

          <form
            className="mt-10 space-y-5"
            onSubmit={async (event) => {
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
            }}
          >
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                <User className="h-4 w-4" />
                Foydalanuvchi nomi
              </span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Foydalanuvchi nomini kiriting"
              />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                <LockKeyhole className="h-4 w-4" />
                Parol
              </span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Parolni kiriting"
              />
            </label>
            {error ? <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
            <button
              className="w-full rounded-2xl bg-accent px-4 py-3 font-semibold text-slate-950 transition hover:opacity-90"
              disabled={loading}
              type="submit"
            >
              {loading ? "Kirilmoqda..." : "Panelga kirish"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
