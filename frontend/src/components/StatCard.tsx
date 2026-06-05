import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, subtitle, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-premium backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="rounded-2xl bg-accent/15 p-3 text-accent">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-400">{subtitle}</p>
    </div>
  );
}
