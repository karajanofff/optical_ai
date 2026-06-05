import { Lightbulb, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

import type { AlertItem } from "../types";

interface AlertRecommendationsProps {
  alert: AlertItem;
  compact?: boolean;
  onResolve?: () => Promise<void>;
}

export function AlertRecommendations({ alert, compact = false, onResolve }: AlertRecommendationsProps) {
  const visibleSteps = compact ? alert.recommendations.slice(0, 2) : alert.recommendations;

  return (
    <div className="mt-3 rounded-2xl border border-amber-400/15 bg-amber-400/5 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-amber-200">
        <Lightbulb className="h-4 w-4" />
        Tuzatish tavsiyalari
      </div>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-300">
        {visibleSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      {compact && alert.recommendations.length > visibleSteps.length ? (
        <p className="mt-2 text-xs text-slate-500">Batafsil tavsiyalar uchun Ogohlantirishlar bo'limiga o'ting.</p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link className="text-sm font-medium text-accent hover:text-white" to={`/devices/${alert.device_id}`}>
          Qurilma tafsiloti
        </Link>
        {onResolve ? (
          <button
            className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/25"
            onClick={() => onResolve()}
            type="button"
          >
            <Wrench className="h-4 w-4" />
            Tuzatildi deb belgilash
          </button>
        ) : null}
      </div>
    </div>
  );
}
